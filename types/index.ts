/**
 * SAP支払条件（OBB8）提案ツールの型定義
 */

/**
 * 基準日運用モード
 * A: 請求書日付（Invoice date）
 * B: 転記日付（Posting date）
 * C: 締日基準（締日に寄せて転記・またはZFBDTを締日に寄せる運用）
 */
export type BaselineMode = 'A' | 'B' | 'C';

/**
 * OBB8（T052）の1行を表すデータ
 */
export interface OBB8Line {
    /** 日限（1〜31、末日は31扱い） */
    day_limit: number;
    /** 固定日（10/20/25/31=月末 等） */
    fixed_day: number;
    /** 追加月（1=翌月、2=翌々月…） */
    add_months: number;
    /** 追加日（ネット○日などで使用） */
    add_days: number;
}

/**
 * テストケース（入力日→期待支払日）
 */
export interface TestCase {
    /** 入力日（例: "1/10", "1/31"） */
    input_date: string;
    /** 期待される支払日（例: "2/28", "3/31"） */
    expected_payment_date: string;
    /** 補足説明（オプション） */
    note?: string;
}

/**
 * 支払条件パターン全体
 */
export interface PaymentPattern {
    /** パターンID（例: "eom_eom_m1"） */
    id: string;
    /** 表示名（例: "月末締 翌月末払い"） */
    display_name: string;
    /** 詳細説明 */
    description: string;
    /** 推奨する基準日運用モード */
    recommended_baseline_mode: BaselineMode;
    /** 基準日モードごとの許容度（A/B/Cそれぞれの安定性） */
    baseline_compatibility: {
        A: 'safe' | 'caution' | 'warning';
        B: 'safe' | 'caution' | 'warning';
        C: 'safe' | 'caution' | 'warning';
    };
    /** OBB8投入用の行セット */
    obb8_lines: OBB8Line[];
    /** 注意事項（基準日運用による警告等） */
    warnings: {
        /** 基準日モード */
        baseline_mode: BaselineMode;
        /** 警告メッセージ */
        message: string;
    }[];
    /** テストケース */
    test_cases: TestCase[];
    /** タグ（検索・フィルタ用） */
    tags: string[];
}

/**
 * 支払条件コード生成結果
 */
export interface GeneratedCode {
    /** 生成されたコード（例: "JP_EOM_EOM_M1"） */
    code: string;
    /** コードの説明 */
    description: string;
}
