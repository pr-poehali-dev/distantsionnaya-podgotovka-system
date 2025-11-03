import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление экзаменационными попытками и статистикой
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными экзаменов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            student_id = params.get('studentId')
            course_id = params.get('courseId')
            
            if not student_id or not course_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'studentId and courseId required'})
                }
            
            cur.execute(
                "SELECT id, started_at, finished_at, time_spent_seconds, correct_answers, total_questions, status FROM exam_attempts WHERE student_id = %s AND course_id = %s ORDER BY started_at DESC",
                (student_id, course_id)
            )
            rows = cur.fetchall()
            
            attempts = []
            for row in rows:
                attempts.append({
                    'id': row[0],
                    'startedAt': row[1].isoformat() if row[1] else None,
                    'finishedAt': row[2].isoformat() if row[2] else None,
                    'timeSpentSeconds': row[3],
                    'correctAnswers': row[4],
                    'totalQuestions': row[5],
                    'status': row[6]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'attempts': attempts})
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'start':
                student_id = body_data.get('studentId')
                course_id = body_data.get('courseId')
                student_name = body_data.get('studentName')
                
                cur.execute(
                    "INSERT INTO exam_attempts (student_id, course_id, student_name, started_at, total_questions) VALUES (%s, %s, %s, CURRENT_TIMESTAMP, 20) RETURNING id",
                    (student_id, course_id, student_name)
                )
                attempt_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'attemptId': attempt_id})
                }
            
            if action == 'finish':
                attempt_id = body_data.get('attemptId')
                answers = body_data.get('answers', [])
                time_spent = body_data.get('timeSpentSeconds')
                
                correct_count = 0
                for answer in answers:
                    is_correct = answer.get('isCorrect', False)
                    if is_correct:
                        correct_count += 1
                    
                    cur.execute(
                        "INSERT INTO exam_answers (exam_attempt_id, question_id, question_text, selected_answer, correct_answer, is_correct) VALUES (%s, %s, %s, %s, %s, %s)",
                        (attempt_id, answer.get('questionId'), answer.get('questionText'), answer.get('selectedAnswer'), answer.get('correctAnswer'), is_correct)
                    )
                
                status = 'passed' if correct_count >= 18 else 'failed'
                
                cur.execute(
                    "UPDATE exam_attempts SET finished_at = CURRENT_TIMESTAMP, time_spent_seconds = %s, correct_answers = %s, status = %s WHERE id = %s",
                    (time_spent, correct_count, status, attempt_id)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'status': status, 'correctAnswers': correct_count})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
