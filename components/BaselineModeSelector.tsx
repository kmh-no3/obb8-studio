'use client';

import { BaselineMode } from '@/types';

interface BaselineModeSelectorProps {
    selectedMode: BaselineMode;
    onSelectMode: (mode: BaselineMode) => void;
    recommendedMode: BaselineMode;
}

const MODE_DESCRIPTIONS: Record<BaselineMode, { label: string; description: string; sapLabel: string }> = {
    A: {
        label: 'A：請求書日付（Invoice date）',
        description: '請求書の日付を基準に支払期日を計算します。請求書日付が基準日となり、そこから固定日・追加月数・追加日数を加算して支払期日を算出します。',
        sapLabel: '伝票日付（Document Date）',
    },
    B: {
        label: 'B：転記日付（Posting date）',
        description: '会計伝票の転記日付を基準に支払期日を計算します。転記日付が基準日となり、最も一般的で推奨される運用方法です。',
        sapLabel: '転記日付（Posting Date）',
    },
    C: {
        label: 'C：締日基準',
        description: '締日に寄せて転記、またはZFBDT（支払基準日）を締日に寄せる運用を行います。締日を基準に支払期日を計算するため、月末締めなどのパターンで安定した運用が可能です。',
        sapLabel: '入力日付（Entry Date）または締日補正',
    },
};

export default function BaselineModeSelector({
    selectedMode,
    onSelectMode,
    recommendedMode,
}: BaselineModeSelectorProps) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
                支払基準日初期値（Payment Baseline Date Initial Value）
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                支払基準日（締日）をどの日付に基づいて決定するかを選択します。この設定により、支払期日の計算方法が変わります。
            </p>
            <div className="space-y-3">
                {(['A', 'B', 'C'] as BaselineMode[]).map((mode) => (
                    <label
                        key={mode}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedMode === mode
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                            }`}
                    >
                        <input
                            type="radio"
                            name="baseline-mode"
                            value={mode}
                            checked={selectedMode === mode}
                            onChange={() => onSelectMode(mode)}
                            className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                            <div className="font-semibold flex items-center flex-wrap gap-2">
                                <span>{MODE_DESCRIPTIONS[mode].label}</span>
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                    （SAP: {MODE_DESCRIPTIONS[mode].sapLabel}）
                                </span>
                                {mode === recommendedMode && (
                                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                        推奨
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {MODE_DESCRIPTIONS[mode].description}
                            </div>
                        </div>
                    </label>
                ))}
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                <h3 className="font-semibold mb-2 text-sm">支払基準日と支払期日の関係</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    支払基準日（締日）は、選択した日付（伝票日付・転記日付など）を基に決定されます。
                    その後、OBB8の設定値（固定日・追加月数・追加日数）を加算して、最終的な支払期日が計算されます。
                </p>
            </div>
        </div>
    );
}
