'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type MacroEstimate = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type FoodEstimateItem = {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type FoodPhotoMacroResult = {
  foods: FoodEstimateItem[];
  totals: MacroEstimate;
  notes?: string;
};

export const FoodPhotoMacros = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<FoodPhotoMacroResult | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  const handleFileChange = (next: File | null) => {
    setFile(next);
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/ai', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error || 'AI analysis failed. Try again.';
        setError(String(msg));
        setResult(null);
        return;
      }

      setResult((data?.result as FoodPhotoMacroResult) || null);
    } catch {
      setError('AI analysis failed. Try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Food Photo Macro Capture
      </h3>

      <Input
        label="Food photo"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        helperText="Upload or capture a photo. Macros are estimates, not medical advice."
      />

      {previewUrl && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <img
            src={previewUrl}
            alt="Food preview"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleAnalyze}
          disabled={!file || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Photo'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleFileChange(null)}
          disabled={isLoading}
          className="flex-1"
        >
          Clear
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">Totals</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {Math.round(result.totals.calories)} cal • {Math.round(result.totals.protein_g)}g protein •{' '}
              {Math.round(result.totals.carbs_g)}g carbs • {Math.round(result.totals.fat_g)}g fat
            </div>
          </div>

          {result.foods?.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Detected foods</div>
              <div className="space-y-1">
                {result.foods.map((f, idx) => (
                  <div key={`${f.name}_${idx}`} className="text-sm text-gray-700 dark:text-gray-300">
                    {f.name}: {Math.round(f.calories)} cal • {Math.round(f.protein_g)}p / {Math.round(f.carbs_g)}c / {Math.round(f.fat_g)}f
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.notes && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {result.notes}
            </div>
          )}

          <div className="text-xs text-gray-600 dark:text-gray-400">
            Estimates can vary by portion size, ingredients, and preparation.
          </div>
        </div>
      )}
    </div>
  );
};
