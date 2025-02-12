// Получаем ссылку на HTML-элемент с id "board"
const board = document.getElementById("board");
// Определяем ряды и колонки
const rows = 8;
const cols = 8;
// Переменная для отслеживания шашки, которую игрок выбрал для перемещения
let selectedPiece = null;
// Переменная для хранения текущего хода
let turn = "white";

function initializeBoard() {
  // Проходим по всем рядам доски
  for (let row = 0; row < rows; row++) {
    // Проходим по всем колонкам
    for (let col = 0; col < cols; col++) {
      // Создаём элемент div для каждой клетки доски
      const cell = document.createElement("div");
      // Добавляем общий класс для всех клеток
      cell.classList.add("cell");
      // Устанавливаем класс для цвета клетки (белая или чёрная)
      cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
      // Сохраняем координаты клетки в атрибуты dataset
      cell.dataset.row = row;
      cell.dataset.col = col;
      // Добавление шашек на доску
      // Чёрные шашки на первых трёх рядах
      if (row < 3 && (row + col) % 2 !== 0) {
        // Добавляем чёрную шашку, если условие чётности позиции выполняется
        addPiece(cell, "black");
        // Белые шашки на последних трёх рядах
        // Добавляем белую шашку, если условие чётности позиции выполняется
      } else if (row > 4 && (row + col) % 2 !== 0) {
        addPiece(cell, "white");
      }
      // Добавляем обработчик события для кликов по клетке
      cell.addEventListener("click", onCellClick);
      // Добавляем клетку на доску
      board.appendChild(cell);
    }
  }
}

function addPiece(cell, color) {
  // Создаём div для шашки
  const piece = document.createElement("div");
  // Добавляем общий класс для всех шашек и класс, определяющий цвет
  piece.classList.add("piece", color);
  // Сохраняем цвет шашки в атрибут dataset
  piece.dataset.color = color;
  // Устанавливаем атрибут, указывающий, что шашка не является дамкой
  piece.dataset.king = "false";
  // Добавляем шашку в клетку
  cell.appendChild(piece);
}
// Обработка кликов по клеткам
function onCellClick(e) {
  // Находим ближайший элемент с классом "cell", который был нажат
  const cell = e.target.closest(".cell");
  // Если такой элемент не найден, выходим из функции
  if (!cell) return;
  // Находим шашку в этой клетке, если она есть
  const piece = cell.querySelector(".piece");
  // Если шашка уже выбрана
  if (selectedPiece) {
    // Проверяем, можно ли сделать ход
    if (canMove(selectedPiece, cell)) {
      // Перемещаем шашку
      movePiece(selectedPiece, cell);
      // Сбрасываем выбранную шашку
      selectedPiece = null;
    } else {
      // Сбрасываем выбранную шашку, если ход невозможен
      selectedPiece = null;
    }
  } else {
    // Если шашка не выбрана и текущий ход соответствует цвету шашки
    if (piece && piece.dataset.color === turn) {
      // Выбираем шашку
      selectedPiece = piece;
    }
  }
}

// Проверка возможности хода на целевую клетку
function canMove(piece, targetCell) {
  // Получаем координаты начальной клетки (где стоит выбранная шашка)
  const startRow = parseInt(piece.parentElement.dataset.row);
  const startCol = parseInt(piece.parentElement.dataset.col);

  // Получаем координаты целевой клетки (куда хотим переместить шашку)
  // Преобразуем строковое значение номера ряда в целое число
  const endRow = parseInt(targetCell.dataset.row);
  // Преобразуем строковое значение номера колонки в целое число
  const endCol = parseInt(targetCell.dataset.col);

  // Определяем направление хода (белые шашки идут вверх, чёрные — вниз)
  const direction = piece.dataset.color === "white" ? -1 : 1;

  // Проверяем, является ли шашка дамкой
  const isKing = piece.dataset.king === "true";

  // Если целевая клетка уже занята другой шашкой, ход невозможен
  if (targetCell.querySelector(".piece")) {
    // Целевая клетка занята
    return false;
  }

  // Проверяем возможность хода для обычной шашки или дамки
  if (!isKing) {
    // Если шашка не дамка, проверяем возможность хода для обычной шашки
    return canMoveRegular(piece, startRow, startCol, endRow, endCol, direction);
  } else {
    // Если шашка дамка, проверяем возможность хода для дамки
    return canMoveKing(piece, startRow, startCol, endRow, endCol);
  }
}

// Проверка возможности хода для обычной шашки
function canMoveRegular(piece, startRow, startCol, endRow, endCol, direction) {
  // Проверка на обычный ход (одна клетка по диагонали)
  if (
    Math.abs(endRow - startRow) === 1 &&
    Math.abs(endCol - startCol) === 1 &&
    endRow - startRow === direction
  ) {
    // Если ход соответствует правилам обычного хода
    return true;
  }
  // Проверка на ход с захватом (две клетки по диагонали)
  if (
    Math.abs(endRow - startRow) === 2 &&
    Math.abs(endCol - startCol) === 2 &&
    endRow - startRow === 2 * direction
  ) {
    // Находим координаты средней клетки (между начальной и целевой)
    const middleRow = (startRow + endRow) / 2;
    const middleCol = (startCol + endCol) / 2;

    // Находим среднюю клетку по координатам
    const middleCell = document.querySelector(
      `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
    );
    // Проверяем, есть ли в средней клетке шашка и если есть, то принадлежит ли она противнику
    // Ищем шашку в средней клетке
    const middlePiece = middleCell.querySelector(".piece");
    // Проверяем, занята ли средняя клетка противником
    if (middlePiece && middlePiece.dataset.color !== piece.dataset.color) {
      // Если допустим ход с захватом
      return true;
    }
  }
  // Невозможный ход
  return false;
}

function canMoveKing(piece, startRow, startCol, endRow, endCol) {
  // Проверяем, что конечная клетка находится на той же диагонали, что и начальная
  if (Math.abs(endRow - startRow) === Math.abs(endCol - startCol)) {
    // Переменная для проверки, свободен ли путь
    let pathClear = true;
    // Переменная для отслеживания захвата шашки
    let middlePieceCaptured = false;
    // Определяем шаги по строкам и столбцам в зависимости от направления движения
    const rowStep = endRow > startRow ? 1 : -1;
    const colStep = endCol > startCol ? 1 : -1;
    // Проходим по всем клеткам на пути перемещения
    for (let i = 1; i < Math.abs(endRow - startRow); i++) {
      // Вычисляем координаты промежуточной клетки на пути
      const intermediateCell = document.querySelector(
        `.cell[data-row="${startRow + i * rowStep}"][data-col="${
          startCol + i * colStep
        }"]`
      );
      // Ищем шашку на этой клетке
      const pieceOnPath = intermediateCell.querySelector(".piece");
      // Если на пути есть шашка
      if (pieceOnPath) {
        // Проверяем, принадлежит ли шашка противнику
        if (pieceOnPath.dataset.color !== piece.dataset.color) {
          // Если шашка противника ещё не была захвачена
          if (middlePieceCaptured) {
            // Путь заблокирован
            pathClear = false;
            // Прерываем цикл проверки
            break;
          } else {
            // Отмечаем, что шашка противника была захвачена
            middlePieceCaptured = true;
          }
        } else {
          // Путь заблокирован другой шашкой
          pathClear = false;
          // Прерываем цикл проверки
          break;
        }
      }
    }
    // Если путь свободен, возвращаем true
    if (pathClear) {
      return true;
    }
  }
  // Если путь не свободен или ход не по диагонали, возвращаем false
  return false;
}

// Перемещение шашки на новую клетку
function movePiece(piece, targetCell) {
  // Получаем начальную строку, где находилась шашка
  const startRow = parseInt(piece.parentElement.dataset.row);
  // Получаем начальный столбец, где находилась шашка
  const startCol = parseInt(piece.parentElement.dataset.col);
  // Получаем конечную строку, куда шашка будет перемещена
  const endRow = parseInt(targetCell.dataset.row);
  // Получаем конечный столбец, куда шашка будет перемещена
  const endCol = parseInt(targetCell.dataset.col);

  // Проверяем, осуществляется ли захват (перемещение на две клетки)
  if (Math.abs(endRow - startRow) === 2 && Math.abs(endCol - startCol) === 2) {
    // Вычисляем координаты серединной клетки между начальной и конечной
    const middleRow = (startRow + endRow) / 2;
    // Вычисляем координаты серединного столбца между начальным и конечным
    const middleCol = (startCol + endCol) / 2;
    // Получаем доступ к серединной клетке
    const middleCell = document.querySelector(
      `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
    );
    // Проверяем, есть ли шашка в серединной клетке
    const middlePiece = middleCell.querySelector(".piece");
    // Удаляем шашку, если она там есть
    if (middlePiece) {
      middleCell.removeChild(middlePiece);
    }
  }

  // Перемещаем шашку в целевую клетку
  targetCell.appendChild(piece);

  // Проверяем, достигла ли шашка последнего ряда для превращения в дамку
  if (
    (piece.dataset.color === "white" && endRow === 0) ||
    (piece.dataset.color === "black" && endRow === 7)
  ) {
    // Отмечаем шашку как дамку
    piece.dataset.king = "true";
    // Добавляем класс, указывающий, что шашка теперь дамка
    piece.classList.add("king");
  }

  //  Переход хода к следующему игроку
  turn = turn === "white" ? "black" : "white";
  // Сбрасываем выбор текущей шашки
  selectedPiece = null;
  // Вызываем функцию для проверки состояния игры после хода
  checkGameState();
}


function checkGameState() {
  // Инициализация переменных для подсчёта шашек и проверки наличия ходов
  // Количество белых шашек на доске
  let whiteCount = 0;
  // Количество чёрных шашек на доске
  let blackCount = 0;
  // Индикатор наличия допустимых ходов у белых
  let whiteHasMoves = false;
  // Индикатор наличия допустимых ходов у чёрных
  let blackHasMoves = false;

  // Перебор всех клеток на доске для проверки шашек и доступных ходов
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Получение клетки по текущим координатам
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      // Попытка найти шашку в данной клетке
      const piece = cell.querySelector(".piece");

      // Проверка наличия шашки в клетке
      if (piece) {
        // Увеличение соответствующего счётчика в зависимости от цвета шашки
        if (piece.dataset.color === "white") {
          // Увеличиваем счётчик белых шашек
          whiteCount++;
          // Проверка наличия доступных ходов для белой шашки
          if (!whiteHasMoves && hasValidMoves(piece)) {
            // Обновление флага доступных ходов для белых
            whiteHasMoves = true;
          }
        } else if (piece.dataset.color === "black") {
          // Увеличиваем счётчик чёрных шашек
          blackCount++;
          // Проверка наличия доступных ходов для чёрной шашки
          if (!blackHasMoves && hasValidMoves(piece)) {
            // Обновление флага доступных ходов для чёрных
            blackHasMoves = true;
          }
        }
      }
    }
  }

  // Проверка валидности позиции на доске
  function isValidPosition(row, col) {
    // Проверяем, что координаты находятся внутри границ доски
    return row >= 0 && row < rows && col >= 0 && col < cols;
  }

  // Проверка условий окончания игры и объявление победителя
  if (whiteCount === 0 || !whiteHasMoves) {
    // Проверка отсутствия шашек или ходов у белых
    // Объявление победы чёрных
    alert("Чёрные выигрывают!");
    // Отключение доски для завершения игры
    disableBoard();
  } else if (blackCount === 0 || !blackHasMoves) {
    // Проверка отсутствия шашек или ходов у чёрных
    // Объявление победы белых
    alert("Белые выигрывают!");
    // Отключение доски для завершения игры
    disableBoard();
  }
}

// Проверка наличия допустимых ходов для шашки
function hasValidMoves(piece) {
  // Получаем начальные координаты шашки
  const startRow = parseInt(piece.parentElement.dataset.row);
  const startCol = parseInt(piece.parentElement.dataset.col);

  // Определяем возможные направления для перемещения
  const directions =
    piece.dataset.king === "true"
      ? [
        // Для дамки: возможность движения во всех направлениях по диагонали
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]
      : piece.dataset.color === "white"
        ? [
          // Для белой шашки: движение только вверх по диагонали
          [-1, 1],
          [-1, -1],
        ]
        : [
          // Для чёрной шашки: движение только вниз по диагонали
          [1, 1],
          [1, -1],
        ];

  // Перебираем все направления движения
  for (let [dr, dc] of directions) {
    // Вычисляем координаты новой строки после хода
    const newRow = startRow + dr;
    // Вычисляем координаты нового столбца после хода
    const newCol = startCol + dc;

    // Проверяем, находится ли новая позиция в пределах доски
    if (isValidPosition(newRow, newCol)) {
      // Находим клетку по новым координатам
      const targetCell = document.querySelector(
        `.cell[data-row="${newRow}"][data-col="${newCol}"]`
      );
      // Проверяем, свободна ли целевая клетка
      if (!targetCell.querySelector(".piece")) {
        return true; // Возвращаем true, если клетка свободна
      }
      // Вычисляем координаты клетки после возможного захвата
      const jumpRow = startRow + 2 * dr;
      const jumpCol = startCol + 2 * dc;
      if (isValidPosition(jumpRow, jumpCol)) {
        // Находим клетку середины, где может находиться шашка противника
        const middleCell = document.querySelector(
          `.cell[data-row="${newRow}"][data-col="${newCol}"]`
        );
        // Находим клетку после захвата
        const jumpCell = document.querySelector(
          `.cell[data-row="${jumpRow}"][data-col="${jumpCol}"]`
        );
        // Проверяем, есть ли в середине шашка противника
        const middlePiece = middleCell.querySelector(".piece");
        // Проверяем, свободна ли целевая клетка после захвата и находится ли в середине шашка противника
        if (
          middlePiece &&
          middlePiece.dataset.color !== piece.dataset.color &&
          !jumpCell.querySelector(".piece")
        ) {
          return true; // Возвращаем true, если возможен ход с захватом
        }
      }
    }
  }
  // Если ни один из возможных ходов не подошёл, возвращаем false
  return false;
}

// Отключение доски (блокировка дальнейших ходов)
function disableBoard() {
  document
    // Удаление обработчиков событий клика со всех клеток
    .querySelectorAll(".cell")
    .forEach((cell) => cell.removeEventListener("click", onCellClick));
}
// Инициализация игры
initializeBoard();
