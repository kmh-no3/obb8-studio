'use client';

import { useState } from 'react';
import { BaselineMode } from '@/types';
import { getAllPatterns, getPatternById } from '@/lib/patterns';
import { generatePaymentCode } from '@/lib/code-generator';
import PatternSelector from '@/components/PatternSelector';
import BaselineModeSelector from '@/components/BaselineModeSelector';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
    const patterns = getAllPatterns();
    const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
    const [baselineMode, setBaselineMode] = useState<BaselineMode>('B');

    const selectedPattern = selectedPatternId ? getPatternById(selectedPatternId) : null;
    const generatedCode = selectedPattern ? generatePaymentCode(selectedPattern) : null;

    // パターン選択時に推奨モードを自動設定
    const handlePatternSelect = (patternId: string) => {
        setSelectedPatternId(patternId);
        const pattern = getPatternById(patternId);
        if (pattern) {
            setBaselineMode(pattern.recommended_baseline_mode);
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* ヘッダー */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                        SAP支払条件（OBB8）提案ツール
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        日本の商習慣に対応した支払条件テンプレートを選択し、OBB8設定値を確認できます
                    </p>
                </header>

                {/* パターン選択 */}
                <PatternSelector
                    patterns={patterns}
                    selectedPatternId={selectedPatternId}
                    onSelectPattern={handlePatternSelect}
                />

                {/* 基準日モード選択（パターン選択後に表示） */}
                {selectedPattern && (
                    <>
                        <BaselineModeSelector
                            selectedMode={baselineMode}
                            onSelectMode={setBaselineMode}
                            recommendedMode={selectedPattern.recommended_baseline_mode}
                        />

                        {/* 結果表示 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <ResultDisplay
                                pattern={selectedPattern}
                                baselineMode={baselineMode}
                                generatedCode={generatedCode!}
                            />
                        </div>
                    </>
                )}

                {/* 初期状態のガイド */}
                {!selectedPattern && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            上から支払パターンを選択してください
                        </p>
                    </div>
                )}

                {/* フッター */}
                <footer className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-500">
                    <p className="mb-2">
                        SAP支払条件（OBB8）提案ツール - MVP版
                    </p>
                    <p>
                        このツールは検討支援を目的としており、実装の確定を保証するものではありません。
                        <br />
                        実際の設定前に必ず実機テストを実施してください。
                    </p>
                </footer>
            </div>
        </main>
    );
}
