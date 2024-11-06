import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { LocationError } from '../types';

interface Props {
  error: LocationError;
}

export function LocationErrorMessage({ error }: Props) {
  const styles = {
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: 'text-red-400',
      border: 'border-red-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
      border: 'border-yellow-100'
    }
  }[error.type];

  return (
    <div className={`${styles.bg} border ${styles.border} p-6 rounded-xl flex items-start gap-4 max-w-xl mx-auto mt-8 shadow-sm`}>
      <AlertCircle className={`${styles.icon} w-6 h-6 flex-shrink-0`} />
      <div>
        <h3 className={`${styles.text} text-lg font-semibold mb-1`}>
          {error.type === 'error' ? 'Error' : 'Warning'}
        </h3>
        <p className={`${styles.text} text-sm opacity-90`}>{error.message}</p>
      </div>
    </div>
  );
}