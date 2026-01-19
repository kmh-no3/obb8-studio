'use client';

import { useMemo, useState } from 'react';
import { PaymentPattern } from '@/types';

interface PatternSelectorProps {
    patterns: PaymentPattern[];
    selectedPatternId: string | null;
    onSelectPattern: (patternId: string) => void;
}

export default function PatternSelector({
    patterns,
    selectedPatternId,
    onSelectPattern,
}: PatternSelectorProps) {
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tagStats = useMemo(() => {
        const counts = new Map<string, number>();
        for (const pattern of patterns) {
            for (const tag of pattern.tags) {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            }
        }

        return Array.from(counts.entries())
            .sort((a, b) => {
                // 件数が多いタグを先に。件数が同じなら日本語順。
                const diff = b[1] - a[1];
                if (diff !== 0) return diff;
                return a[0].localeCompare(b[0], 'ja');
            })
            .map(([tag, count]) => ({ tag, count }));
    }, [patterns]);

    const filteredPatterns = useMemo(() => {
        const q = query.trim().toLowerCase();
        const hasQuery = q.length > 0;
        const hasTags = selectedTags.length > 0;

        return patterns.filter((pattern) => {
            if (hasTags) {
                // AND 検索：選択したタグをすべて含むパターンのみ
                for (const tag of selectedTags) {
                    if (!pattern.tags.includes(tag)) return false;
                }
            }

            if (!hasQuery) return true;

            const haystack = [
                pattern.display_name,
                pattern.description,
                ...pattern.tags,
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(q);
        });
    }, [patterns, query, selectedTags]);

    const hasActiveFilters = query.trim().length > 0 || selectedTags.length > 0;

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
    };

    const clearFilters = () => {
        setQuery('');
        setSelectedTags([]);
    };

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-xl font-semibold">支払パターンを選択</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        名前・説明・タグで検索できます（{filteredPatterns.length}/{patterns.length}件）
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="例: 月末 / 20日締 / サイト60 / 固定日払"
                        className="w-full sm:w-80 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                    >
                        クリア
                    </button>
                </div>
            </div>

            {tagStats.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            タグで絞り込み
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            複数選択可（AND）
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tagStats.map(({ tag, count }) => {
                            const selected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    aria-pressed={selected}
                                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${selected
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {tag}
                                    <span className="ml-1 opacity-70">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {filteredPatterns.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center mb-4">
                    <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                        該当するパターンがありません
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        検索語やタグ条件を調整してください。
                    </p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        条件をリセット
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredPatterns.map((pattern) => (
                    <button
                        key={pattern.id}
                        onClick={() => onSelectPattern(pattern.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedPatternId === pattern.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                            }`}
                    >
                        <h3 className="font-bold text-lg mb-2">{pattern.display_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {pattern.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pattern.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
