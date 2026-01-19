'use client';

import { PaymentPattern, BaselineMode, GeneratedCode } from '@/types';
import { convertLinesToTableRows, OBB8TableRow } from '@/lib/code-generator';

interface ResultDisplayProps {
    pattern: PaymentPattern;
    baselineMode: BaselineMode;
    generatedCode: GeneratedCode;
}

export default function ResultDisplay({
    pattern,
    baselineMode,
    generatedCode,
}: ResultDisplayProps) {
    const tableRows: OBB8TableRow[] = convertLinesToTableRows(pattern.obb8_lines);
    const warnings = pattern.warnings.filter((w) => w.baseline_mode === baselineMode);

    return (
        <div className="space-y-6">
            {/* 推奨コード */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h2 className="text-xl font-semibold mb-2">支払条件（Payment Condition）</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    SAPのOBB8で設定する支払条件コードです。このコードをマスタデータに登録し、取引先や取引先グループに割り当てます。
                </p>
                <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">推奨コード</div>
                    <div className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {generatedCode.code}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">説明（Description）</div>
                    <p className="text-gray-700 dark:text-gray-300">{generatedCode.description}</p>
                </div>
            </div>

            {/* 警告メッセージ */}
            {warnings.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded">
                    <div className="flex items-start">
                        <svg
                            className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <div>
                            <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">注意事項</h3>
                            {warnings.map((warning, index) => (
                                <p key={index} className="text-amber-700 dark:text-amber-200 mb-2">
                                    {warning.message}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* OBB8投入値 */}
            <div>
                <h2 className="text-xl font-semibold mb-3">OBB8投入値（T052相当）</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    支払基準日（締日）と支払期日を算出するための設定値です。SAPのOBB8トランザクションで使用します。
                </p>
                {/* 計算フローの説明 */}
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold mb-2 text-green-900 dark:text-green-200 text-sm">計算の流れ</h3>
                    <ol className="text-sm text-green-800 dark:text-green-300 space-y-1 list-decimal list-inside">
                        <li>
                            <strong>締日（支払基準日）の算出：</strong>
                            伝票日付・転記日付などから、<strong>期限（日限）</strong>と<strong>支払基準日計算</strong>の<strong>固定日・追加月</strong>を使って締日を決定します。
                        </li>
                        <li>
                            <strong>支払期日の算出：</strong>
                            算出された締日から、<strong>支払条件</strong>の<strong>固定日・追加月数</strong>を加算して支払期日を計算します。
                        </li>
                    </ol>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    行
                                </th>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    <div className="flex items-center gap-2">
                                        <span>対象期間</span>
                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            （締日の範囲）
                                        </span>
                                    </div>
                                </th>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span>日限</span>
                                            <span className="text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                                                締日
                                            </span>
                                        </div>
                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            （①期限 / Day limit）
                                        </span>
                                    </div>
                                </th>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span>固定日</span>
                                            <span className="text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                                期日
                                            </span>
                                        </div>
                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            （①Fixed day）
                                        </span>
                                    </div>
                                </th>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span>追加月数</span>
                                            <span className="text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                                期日
                                            </span>
                                        </div>
                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            （②Add months）
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row) => (
                                <tr key={row.lineNumber} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {row.lineNumber}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {row.description}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono">
                                        {row.dayLimit}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono">
                                        {row.fixedDay}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono">
                                        {row.addMonths}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* 項目説明 */}
                <div className="mt-4 space-y-4">
                    {/* 締日算出に関する項目 */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-200">
                            ■ 締日（支払基準日）算出に使用する項目
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                    ① 期限（日限 / Day limit）
                                </dt>
                                <dd className="text-purple-700 dark:text-purple-300 ml-4">
                                    締日を計算する際の日数制限です。1〜31の値を設定し、31は月末を意味します。
                                    この日限までの日付が対象期間として扱われ、どの日付範囲がこの行の設定を適用するかを決定します。
                                    <span className="block mt-1 text-xs italic">
                                        （例：31を設定すると、1日〜31日（月末）までの伝票がこの行の設定を適用されます）
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                    ② 固定日（Fixed day）
                                </dt>
                                <dd className="text-purple-700 dark:text-purple-300 ml-4">
                                    締日を特定の日に補正します。10/15/20/25/31（月末）などが一般的です。
                                    固定日が31の場合は、その月の末日が締日となります。
                                    <span className="block mt-1 text-xs italic">
                                        （SAP OBB8の「支払基準日計算」セクションで設定します）
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                                    ③ 追加月（Add months）
                                </dt>
                                <dd className="text-purple-700 dark:text-purple-300 ml-4">
                                    基準日から何ヶ月後に締日を設定するかを指定します。
                                    0=当月、1=翌月、2=翌々月となります。
                                    <span className="block mt-1 text-xs italic">
                                        （SAP OBB8の「支払基準日計算」セクションで設定します）
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* 支払期日算出に関する項目 */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">
                            ■ 支払期日算出に使用する項目（支払条件セクション）
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                    ① 固定日（Fixed day）
                                </dt>
                                <dd className="text-blue-700 dark:text-blue-300 ml-4">
                                    算出された締日から、支払期日を特定の日に固定します。10/15/20/25/31（月末）などが一般的です。
                                    固定日が31の場合は、その月の末日が支払期日となります。
                                    <span className="block mt-1 text-xs italic">
                                        （例：「月末締 翌月15日払い」の場合、締日が1月末なら支払期日は2月15日となります）
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                    ② 追加月数（Add months）
                                </dt>
                                <dd className="text-blue-700 dark:text-blue-300 ml-4">
                                    締日から何ヶ月後に支払期日を設定するかを指定します。
                                    0=当月、1=翌月、2=翌々月となります。
                                    <span className="block mt-1 text-xs italic">
                                        （例：「月末締 翌月末払い」の場合、締日が1月末なら追加月数1で支払期日は2月末となります）
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* テストケース */}
            <div>
                <h2 className="text-xl font-semibold mb-2">テストケース</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    以下の入力日（伝票日付・転記日付など）で支払期日が正しく計算されるか確認してください。
                    閏年や実際の月末日（2月28日/29日、30日月、31日月）に注意して検証してください。
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    <div className="flex flex-col">
                                        <span>入力日</span>
                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            （基準日となる日付）
                                        </span>
                                    </div>
                                </th>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    <div className="flex flex-col">
                                        <span>期待される支払期日</span>
                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                            （計算結果）
                                        </span>
                                    </div>
                                </th>
                                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                                    備考
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pattern.test_cases.map((testCase, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {testCase.input_date}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">
                                        {testCase.expected_payment_date}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                        {testCase.note}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 免責事項 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                <h3 className="font-semibold mb-2">免責事項</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                    <li>このツールは設定値の提案・検討支援を目的としており、実装の確定を保証するものではありません。</li>
                    <li>実際の運用では、休日補正、支払プログラム、銀行連携等の設計が別途必要です。</li>
                    <li>設定前に必ず実機テストを実施してください。</li>
                    <li>SAP公式ドキュメントもあわせてご確認ください。</li>
                </ul>
            </div>
        </div>
    );
}
