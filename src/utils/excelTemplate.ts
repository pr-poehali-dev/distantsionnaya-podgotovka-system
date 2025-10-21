import * as XLSX from 'xlsx';

export const generateExcelTemplate = () => {
  const headers = [
    'ФИО',
    'Должность',
    'Email',
    'Охрана труда для руководителей',
    'Пожарная безопасность',
    'Электробезопасность до 1000В',
    'Промышленная безопасность'
  ];

  const exampleData = [
    [
      'Иванов Иван Иванович',
      'Инженер',
      'ivanov@example.com',
      'X',
      'X',
      '',
      ''
    ],
    [
      'Петрова Мария Сергеевна',
      'Главный специалист',
      'petrova@example.com',
      'X',
      '',
      'X',
      ''
    ],
    [
      'Сидоров Петр Александрович',
      'Мастер участка',
      'sidorov@example.com',
      '',
      'X',
      'X',
      'X'
    ]
  ];

  const ws_data = [
    headers,
    ...exampleData
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  ws['!cols'] = [
    { wch: 30 },
    { wch: 25 },
    { wch: 25 },
    { wch: 32 },
    { wch: 28 },
    { wch: 32 },
    { wch: 32 }
  ];

  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!ws[address]) continue;
    ws[address].s = {
      font: { bold: true, sz: 12 },
      fill: { fgColor: { rgb: 'E0E7FF' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Список слушателей');

  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ['ИНСТРУКЦИЯ ПО ЗАПОЛНЕНИЮ ШАБЛОНА'],
    [''],
    ['1. Столбец "ФИО" - обязательное поле. Укажите полное ФИО слушателя.'],
    ['2. Столбец "Должность" - обязательное поле. Укажите должность сотрудника.'],
    ['3. Столбец "Email" - необязательное поле. Укажите email для отправки учетных данных.'],
    ['4. Столбцы с названиями курсов - отметьте любым символом (X, +, 1) курсы, на которые нужно записать слушателя.'],
    [''],
    ['ВАЖНО:'],
    ['- Один слушатель может быть записан на несколько курсов одновременно.'],
    ['- Не удаляйте заголовки столбцов.'],
    ['- Начинайте заполнение данных со второй строки.'],
    ['- Можно добавлять неограниченное количество слушателей.'],
    [''],
    ['После заполнения:'],
    ['1. Сохраните файл.'],
    ['2. Загрузите его в форму создания заявки.'],
    ['3. Система автоматически создаст аккаунты и назначит выбранные курсы.']
  ]);

  instructionsWs['!cols'] = [{ wch: 100 }];
  
  const titleCell = instructionsWs['A1'];
  if (titleCell) {
    titleCell.s = {
      font: { bold: true, sz: 14 },
      fill: { fgColor: { rgb: 'DBEAFE' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  XLSX.utils.book_append_sheet(wb, instructionsWs, 'Инструкция');

  XLSX.writeFile(wb, 'Шаблон_заявки_на_обучение.xlsx');
};
