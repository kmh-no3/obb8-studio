import { PaymentPattern } from '@/types';

/**
 * SAP支払条件テンプレート定義
 * 日本の商習慣で頻出する支払パターン
 */

export const PAYMENT_PATTERNS: PaymentPattern[] = [
    {
        id: 'eom_eom_m1',
        display_name: '月末締 翌月末払い',
        description: '当月末日締め、翌月末日払い。最も一般的な支払条件の一つ。',
        recommended_baseline_mode: 'B',
        baseline_compatibility: {
            A: 'safe',
            B: 'safe',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 31,
                fixed_day: 31,
                add_months: 1,
                add_days: 0,
            },
        ],
        warnings: [],
        test_cases: [
            {
                input_date: '1/10',
                expected_payment_date: '2/28',
                note: '月初の取引',
            },
            {
                input_date: '1/20',
                expected_payment_date: '2/28',
                note: '月中の取引',
            },
            {
                input_date: '1/31',
                expected_payment_date: '2/28',
                note: '締日当日の取引',
            },
            {
                input_date: '2/15',
                expected_payment_date: '3/31',
                note: '2月の取引',
            },
            {
                input_date: '12/25',
                expected_payment_date: '翌年1/31',
                note: '年末の取引',
            },
        ],
        tags: ['月末締', '月末払', 'サイト30', '標準'],
    },
    {
        id: 'eom_eom_m2',
        display_name: '月末締 翌々月末払い',
        description: '当月末日締め、翌々月末日払い。サイトが長い取引先向け。',
        recommended_baseline_mode: 'B',
        baseline_compatibility: {
            A: 'safe',
            B: 'safe',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 31,
                fixed_day: 31,
                add_months: 2,
                add_days: 0,
            },
        ],
        warnings: [],
        test_cases: [
            {
                input_date: '1/10',
                expected_payment_date: '3/31',
                note: '月初の取引',
            },
            {
                input_date: '1/20',
                expected_payment_date: '3/31',
                note: '月中の取引',
            },
            {
                input_date: '1/31',
                expected_payment_date: '3/31',
                note: '締日当日の取引',
            },
            {
                input_date: '2/15',
                expected_payment_date: '4/30',
                note: '2月の取引',
            },
            {
                input_date: '11/25',
                expected_payment_date: '翌年1/31',
                note: '年末近くの取引',
            },
        ],
        tags: ['月末締', '月末払', 'サイト60', '長期'],
    },
    {
        id: 'eom_d10_m0',
        display_name: '月末締 翌月10日払い',
        description:
            '当月末日締め、翌月10日払い。固定日払いは基準日の運用次第で支払月がズレやすいため、締日基準（C）運用を前提に検討してください。',
        recommended_baseline_mode: 'C',
        baseline_compatibility: {
            A: 'warning',
            B: 'warning',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 31,
                fixed_day: 10,
                add_months: 0,
                add_days: 0,
            },
        ],
        warnings: [
            {
                baseline_mode: 'A',
                message:
                    '固定日払い（10日）は、請求書日付基準（A）だと月初計上が当月10日扱いになりやすく、意図した「翌月10日」にならない可能性があります。締日基準（C）運用を推奨します。',
            },
            {
                baseline_mode: 'B',
                message:
                    '固定日払い（10日）は、転記日付基準（B）だと月初の転記が当月10日扱いになりやすく、意図した「翌月10日」にならない可能性があります。締日基準（C）運用を推奨します。',
            },
            {
                baseline_mode: 'C',
                message:
                    '前提：締日に寄せて転記する、またはZFBDT（基準日）を月末に寄せる運用を行ってください。支払日が休日の場合の補正は、支払プログラム/支払実行日設計で別途検討が必要です。',
            },
        ],
        test_cases: [
            {
                input_date: '1/31',
                expected_payment_date: '2/10',
                note: '締日基準（C）：ZFBDT=月末（1/31）を想定',
            },
            {
                input_date: '2/28',
                expected_payment_date: '3/10',
                note: '2月（非閏年）',
            },
            {
                input_date: '2/29',
                expected_payment_date: '3/10',
                note: '閏年想定',
            },
            {
                input_date: '4/30',
                expected_payment_date: '5/10',
                note: '30日月の月末',
            },
            {
                input_date: '12/31',
                expected_payment_date: '翌年1/10',
                note: '年またぎ',
            },
        ],
        tags: ['月末締', '10日払', '固定日払', '要注意', 'サイト10'],
    },
    {
        id: 'eom_d25_m0',
        display_name: '月末締 翌月25日払い',
        description:
            '当月末日締め、翌月25日払い。固定日払いは基準日の運用次第で支払月がズレやすいため、締日基準（C）運用を前提に検討してください。',
        recommended_baseline_mode: 'C',
        baseline_compatibility: {
            A: 'warning',
            B: 'warning',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 31,
                fixed_day: 25,
                add_months: 0,
                add_days: 0,
            },
        ],
        warnings: [
            {
                baseline_mode: 'A',
                message:
                    '固定日払い（25日）は、請求書日付基準（A）だと月初計上が当月25日扱いになりやすく、意図した「翌月25日」にならない可能性があります。締日基準（C）運用を推奨します。',
            },
            {
                baseline_mode: 'B',
                message:
                    '固定日払い（25日）は、転記日付基準（B）だと月初の転記が当月25日扱いになりやすく、意図した「翌月25日」にならない可能性があります。締日基準（C）運用を推奨します。',
            },
            {
                baseline_mode: 'C',
                message:
                    '前提：締日に寄せて転記する、またはZFBDT（基準日）を月末に寄せる運用を行ってください。支払日が休日の場合の補正は、支払プログラム/支払実行日設計で別途検討が必要です。',
            },
        ],
        test_cases: [
            {
                input_date: '1/31',
                expected_payment_date: '2/25',
                note: '締日基準（C）：ZFBDT=月末（1/31）を想定',
            },
            {
                input_date: '2/28',
                expected_payment_date: '3/25',
                note: '2月（非閏年）',
            },
            {
                input_date: '4/30',
                expected_payment_date: '5/25',
                note: '30日月の月末',
            },
            {
                input_date: '6/30',
                expected_payment_date: '7/25',
                note: '月末が30日でも固定日は25日',
            },
            {
                input_date: '12/31',
                expected_payment_date: '翌年1/25',
                note: '年またぎ',
            },
        ],
        tags: ['月末締', '25日払', '固定日払', '要注意', 'サイト25'],
    },
    {
        id: 'd20_eom_m1m2',
        display_name: '20日締 翌月末払い',
        description:
            '当月1〜20日分は翌月末払い、21日〜末日分は翌々月末払い。2行構成の典型例。',
        recommended_baseline_mode: 'B',
        baseline_compatibility: {
            A: 'caution',
            B: 'safe',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 20,
                fixed_day: 31,
                add_months: 1,
                add_days: 0,
            },
            {
                day_limit: 31,
                fixed_day: 31,
                add_months: 2,
                add_days: 0,
            },
        ],
        warnings: [
            {
                baseline_mode: 'A',
                message:
                    '請求書日付基準（A）の場合、請求書発行タイミングによって支払月がずれる可能性があります。転記日付（B）または締日基準（C）の運用を推奨します。',
            },
        ],
        test_cases: [
            {
                input_date: '1/10',
                expected_payment_date: '2/28',
                note: '20日以前 → 翌月末',
            },
            {
                input_date: '1/20',
                expected_payment_date: '2/28',
                note: '締日当日 → 翌月末',
            },
            {
                input_date: '1/21',
                expected_payment_date: '3/31',
                note: '21日以降 → 翌々月末',
            },
            {
                input_date: '1/31',
                expected_payment_date: '3/31',
                note: '月末 → 翌々月末',
            },
            {
                input_date: '2/15',
                expected_payment_date: '3/31',
                note: '2月の取引（20日以前）',
            },
        ],
        tags: ['20日締', '月末払', 'サイト変動', '2行構成'],
    },
    {
        id: 'd20_eom_m2m3',
        display_name: '20日締 翌々月末払い',
        description:
            '当月1〜20日分は翌々月末払い、21日〜末日分は翌々々月末払い。サイトが長めの取引先向け（2行構成）。',
        recommended_baseline_mode: 'B',
        baseline_compatibility: {
            A: 'caution',
            B: 'safe',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 20,
                fixed_day: 31,
                add_months: 2,
                add_days: 0,
            },
            {
                day_limit: 31,
                fixed_day: 31,
                add_months: 3,
                add_days: 0,
            },
        ],
        warnings: [
            {
                baseline_mode: 'A',
                message:
                    '請求書日付基準（A）の場合、請求書発行タイミングによって支払月がずれる可能性があります。転記日付（B）または締日基準（C）の運用を推奨します。',
            },
        ],
        test_cases: [
            {
                input_date: '1/10',
                expected_payment_date: '3/31',
                note: '20日以前 → 翌々月末',
            },
            {
                input_date: '1/20',
                expected_payment_date: '3/31',
                note: '締日当日 → 翌々月末',
            },
            {
                input_date: '1/21',
                expected_payment_date: '4/30',
                note: '21日以降 → 翌々々月末',
            },
            {
                input_date: '1/31',
                expected_payment_date: '4/30',
                note: '月末 → 翌々々月末',
            },
            {
                input_date: '2/15',
                expected_payment_date: '4/30',
                note: '2月の取引（20日以前）',
            },
        ],
        tags: ['20日締', '月末払', 'サイト長期', '2行構成'],
    },
    {
        id: 'd15_eom_m1m2',
        display_name: '15日締 翌月末払い',
        description:
            '当月1〜15日分は翌月末払い、16日〜末日分は翌々月末払い。半月締めの代表例（2行構成）。',
        recommended_baseline_mode: 'B',
        baseline_compatibility: {
            A: 'caution',
            B: 'safe',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 15,
                fixed_day: 31,
                add_months: 1,
                add_days: 0,
            },
            {
                day_limit: 31,
                fixed_day: 31,
                add_months: 2,
                add_days: 0,
            },
        ],
        warnings: [
            {
                baseline_mode: 'A',
                message:
                    '請求書日付基準（A）の場合、請求書発行タイミングによって支払月がずれる可能性があります。転記日付（B）または締日基準（C）の運用を推奨します。',
            },
        ],
        test_cases: [
            {
                input_date: '1/10',
                expected_payment_date: '2/28',
                note: '15日以前 → 翌月末',
            },
            {
                input_date: '1/15',
                expected_payment_date: '2/28',
                note: '締日当日 → 翌月末',
            },
            {
                input_date: '1/16',
                expected_payment_date: '3/31',
                note: '16日以降 → 翌々月末',
            },
            {
                input_date: '1/31',
                expected_payment_date: '3/31',
                note: '月末 → 翌々月末',
            },
            {
                input_date: '2/14',
                expected_payment_date: '3/31',
                note: '2月の取引（15日以前）',
            },
        ],
        tags: ['15日締', '月末払', 'サイト変動', '2行構成'],
    },
    {
        id: 'd10_eom_m1m2',
        display_name: '10日締 翌月末払い',
        description:
            '当月1〜10日分は翌月末払い、11日〜末日分は翌々月末払い。短い締めサイクルの例（2行構成）。',
        recommended_baseline_mode: 'B',
        baseline_compatibility: {
            A: 'caution',
            B: 'safe',
            C: 'safe',
        },
        obb8_lines: [
            {
                day_limit: 10,
                fixed_day: 31,
                add_months: 1,
                add_days: 0,
            },
            {
                day_limit: 31,
                fixed_day: 31,
                add_months: 2,
                add_days: 0,
            },
        ],
        warnings: [
            {
                baseline_mode: 'A',
                message:
                    '請求書日付基準（A）の場合、請求書発行タイミングによって支払月がずれる可能性があります。転記日付（B）または締日基準（C）の運用を推奨します。',
            },
        ],
        test_cases: [
            {
                input_date: '1/5',
                expected_payment_date: '2/28',
                note: '10日以前 → 翌月末',
            },
            {
                input_date: '1/10',
                expected_payment_date: '2/28',
                note: '締日当日 → 翌月末',
            },
            {
                input_date: '1/11',
                expected_payment_date: '3/31',
                note: '11日以降 → 翌々月末',
            },
            {
                input_date: '1/31',
                expected_payment_date: '3/31',
                note: '月末 → 翌々月末',
            },
            {
                input_date: '2/15',
                expected_payment_date: '4/30',
                note: '2月の取引（11日以降）',
            },
        ],
        tags: ['10日締', '月末払', 'サイト変動', '2行構成'],
    },
];

/**
 * IDからパターンを取得
 */
export function getPatternById(id: string): PaymentPattern | undefined {
    return PAYMENT_PATTERNS.find((pattern) => pattern.id === id);
}

/**
 * タグでパターンを検索
 */
export function getPatternsByTag(tag: string): PaymentPattern[] {
    return PAYMENT_PATTERNS.filter((pattern) => pattern.tags.includes(tag));
}

/**
 * 全パターンを取得
 */
export function getAllPatterns(): PaymentPattern[] {
    return PAYMENT_PATTERNS;
}
