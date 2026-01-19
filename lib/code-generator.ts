import { PaymentPattern, GeneratedCode, OBB8Line } from '@/types';

/**
 * 支払条件コード生成ロジック
 * 命名規則: JP_{締日}_{支払日}_{追加月}
 */

/**
 * 日限から締日表記を生成
 */
function getDayLimitCode(dayLimit: number): string {
    if (dayLimit === 31) {
        return 'EOM'; // End of Month
    }
    return `D${dayLimit}`;
}

/**
 * 固定日から支払日表記を生成
 */
function getFixedDayCode(fixedDay: number): string {
    if (fixedDay === 31) {
        return 'EOM'; // End of Month
    }
    return `D${fixedDay}`;
}

/**
 * 追加月から月表記を生成
 */
function getAddMonthsCode(addMonths: number): string {
    return `M${addMonths}`;
}

/**
 * OBB8行から支払条件コードを生成
 */
function generateCodeFromLines(lines: OBB8Line[]): string {
    const prefix = 'JP';

    if (lines.length === 1) {
        // 1行の場合: 単純なパターン
        const line = lines[0];
        const dayLimit = getDayLimitCode(line.day_limit);
        const fixedDay = getFixedDayCode(line.fixed_day);
        const addMonths = getAddMonthsCode(line.add_months);

        return `${prefix}_${dayLimit}_${fixedDay}_${addMonths}`;
    } else if (lines.length === 2) {
        // 2行の場合: 締日分割パターン
        const line1 = lines[0];
        const line2 = lines[1];

        const dayLimit = getDayLimitCode(line1.day_limit);
        const fixedDay = getFixedDayCode(line1.fixed_day);
        const addMonths1 = getAddMonthsCode(line1.add_months);
        const addMonths2 = getAddMonthsCode(line2.add_months);

        return `${prefix}_${dayLimit}_${fixedDay}_${addMonths1}${addMonths2}`;
    } else {
        // 3行以上の場合: 複雑なパターン
        return `${prefix}_CUSTOM_${lines.length}L`;
    }
}

/**
 * 支払条件コードの説明文を生成
 */
function generateDescription(pattern: PaymentPattern): string {
    const lines = pattern.obb8_lines;

    if (lines.length === 1) {
        const line = lines[0];
        const dayLimitText = line.day_limit === 31 ? '月末' : `${line.day_limit}日`;
        const fixedDayText = line.fixed_day === 31 ? '月末' : `${line.fixed_day}日`;

        // 固定日払いで add_months=0 を使う場合は「締日基準（C）運用で月末に寄せる」などの前提で
        // 翌月固定日に着地させることが多いため、説明文は 0ヶ月後 ではなく「翌月」として扱う。
        // ※OBB8の実計算は基準日運用と組み合わせて必ず実機テストが必要。
        const addMonthsText =
            line.add_months === 0 && line.fixed_day !== 31
                ? '翌月'
                : line.add_months === 1
                    ? '翌月'
                    : line.add_months === 2
                        ? '翌々月'
                        : `${line.add_months}ヶ月後`;

        const requiresClosingBasisNote = line.add_months === 0 && line.fixed_day !== 31;
        return `${dayLimitText}締 ${addMonthsText}${fixedDayText}払い${requiresClosingBasisNote ? '（締日基準前提）' : ''}`;
    } else if (lines.length === 2) {
        const line1 = lines[0];
        const line2 = lines[1];

        const dayLimit1Text = line1.day_limit === 31 ? '月末' : `${line1.day_limit}日`;
        const dayLimit2Text = line2.day_limit === 31 ? '月末' : `${line2.day_limit}日`;
        const fixedDayText = line1.fixed_day === 31 ? '月末' : `${line1.fixed_day}日`;
        const addMonths1Text = line1.add_months === 1 ? '翌月' : `${line1.add_months}ヶ月後`;
        const addMonths2Text = line2.add_months === 1 ? '翌月' : `${line2.add_months}ヶ月後`;

        return `${dayLimit1Text}締 ${addMonths1Text}${fixedDayText}払い（${line1.day_limit + 1}日〜${dayLimit2Text}は${addMonths2Text}${fixedDayText}払い）`;
    } else {
        return `複数締日パターン（${lines.length}行構成）`;
    }
}

/**
 * 支払条件パターンから推奨コードを生成
 */
export function generatePaymentCode(pattern: PaymentPattern): GeneratedCode {
    const code = generateCodeFromLines(pattern.obb8_lines);
    const description = generateDescription(pattern);

    return {
        code,
        description,
    };
}

/**
 * OBB8行を表形式のデータに変換（表示用）
 */
export interface OBB8TableRow {
    lineNumber: number;
    dayLimit: string;
    fixedDay: string;
    addMonths: string;
    addDays: string;
    description: string;
}

export function convertLinesToTableRows(lines: OBB8Line[]): OBB8TableRow[] {
    return lines.map((line, index) => {
        const dayLimitText = line.day_limit === 31 ? '31（月末）' : line.day_limit.toString();
        const fixedDayText = line.fixed_day === 31 ? '31（月末）' : line.fixed_day.toString();

        let description = '';
        if (lines.length === 1) {
            description = '全期間';
        } else if (index === 0) {
            description = `1日〜${line.day_limit}日`;
        } else if (index === lines.length - 1) {
            const prevDayLimit = lines[index - 1].day_limit;
            description = `${prevDayLimit + 1}日〜月末`;
        } else {
            const prevDayLimit = lines[index - 1].day_limit;
            description = `${prevDayLimit + 1}日〜${line.day_limit}日`;
        }

        return {
            lineNumber: index + 1,
            dayLimit: dayLimitText,
            fixedDay: fixedDayText,
            addMonths: line.add_months.toString(),
            addDays: line.add_days.toString(),
            description,
        };
    });
}
