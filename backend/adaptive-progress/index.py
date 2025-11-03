import json
import os
import psycopg2
from typing import Dict, Any, List
import random

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление прогрессом адаптивного теста
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными прогресса
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
                "SELECT question_id, correct_streak, is_mastered, is_in_active_set FROM adaptive_test_progress WHERE student_id = %s AND course_id = %s",
                (student_id, course_id)
            )
            rows = cur.fetchall()
            
            progress = []
            for row in rows:
                progress.append({
                    'questionId': row[0],
                    'correctStreak': row[1],
                    'isMastered': row[2],
                    'isInActiveSet': row[3]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'progress': progress})
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'init':
                student_id = body_data.get('studentId')
                course_id = body_data.get('courseId')
                all_question_ids = body_data.get('allQuestionIds', [])
                
                cur.execute(
                    "SELECT COUNT(*) FROM adaptive_test_progress WHERE student_id = %s AND course_id = %s",
                    (student_id, course_id)
                )
                existing_count = cur.fetchone()[0]
                
                if existing_count == 0:
                    selected_ids = random.sample(all_question_ids, min(20, len(all_question_ids)))
                    
                    for qid in selected_ids:
                        cur.execute(
                            "INSERT INTO adaptive_test_progress (student_id, course_id, question_id, correct_streak, is_mastered, is_in_active_set) VALUES (%s, %s, %s, 0, FALSE, TRUE)",
                            (student_id, course_id, qid)
                        )
                    
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'message': 'Initialized', 'activeSet': selected_ids})
                    }
                else:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'message': 'Already initialized'})
                    }
            
            if action == 'answer':
                student_id = body_data.get('studentId')
                course_id = body_data.get('courseId')
                question_id = body_data.get('questionId')
                is_correct = body_data.get('isCorrect')
                all_question_ids = body_data.get('allQuestionIds', [])
                
                cur.execute(
                    "SELECT correct_streak FROM adaptive_test_progress WHERE student_id = %s AND course_id = %s AND question_id = %s",
                    (student_id, course_id, question_id)
                )
                row = cur.fetchone()
                
                if is_correct:
                    new_streak = (row[0] if row else 0) + 1
                    is_mastered = new_streak >= 3
                    
                    cur.execute(
                        "INSERT INTO adaptive_test_progress (student_id, course_id, question_id, correct_streak, is_mastered, is_in_active_set) VALUES (%s, %s, %s, %s, %s, TRUE) ON CONFLICT (student_id, course_id, question_id) DO UPDATE SET correct_streak = %s, is_mastered = %s, is_in_active_set = CASE WHEN %s THEN FALSE ELSE adaptive_test_progress.is_in_active_set END, updated_at = CURRENT_TIMESTAMP",
                        (student_id, course_id, question_id, new_streak, is_mastered, new_streak, is_mastered, is_mastered)
                    )
                    
                    if is_mastered:
                        cur.execute(
                            "SELECT question_id FROM adaptive_test_progress WHERE student_id = %s AND course_id = %s AND is_in_active_set = TRUE",
                            (student_id, course_id)
                        )
                        active_questions = [r[0] for r in cur.fetchall()]
                        
                        cur.execute(
                            "SELECT question_id FROM adaptive_test_progress WHERE student_id = %s AND course_id = %s AND (is_mastered = TRUE OR is_in_active_set = TRUE)",
                            (student_id, course_id)
                        )
                        used_questions = set(r[0] for r in cur.fetchall())
                        
                        available = [qid for qid in all_question_ids if qid not in used_questions]
                        
                        if available:
                            new_qid = random.choice(available)
                            cur.execute(
                                "INSERT INTO adaptive_test_progress (student_id, course_id, question_id, correct_streak, is_mastered, is_in_active_set) VALUES (%s, %s, %s, 0, FALSE, TRUE)",
                                (student_id, course_id, new_qid)
                            )
                            active_questions.append(new_qid)
                        
                        conn.commit()
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'mastered': True, 'activeSet': active_questions})
                        }
                else:
                    cur.execute(
                        "INSERT INTO adaptive_test_progress (student_id, course_id, question_id, correct_streak, is_mastered, is_in_active_set) VALUES (%s, %s, %s, 0, FALSE, TRUE) ON CONFLICT (student_id, course_id, question_id) DO UPDATE SET correct_streak = 0, updated_at = CURRENT_TIMESTAMP",
                        (student_id, course_id, question_id)
                    )
                
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'updated': True})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
