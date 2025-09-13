import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface YieldPrediction {
  type: 'yield';
  data: {
    predicted_yield: number;
    predicted_weekly_yield: number;
    optimization_hint: string;
    explanation: string;
    tips: string[];
  };
  timestamp: Date;
}

export interface DiseasePrediction {
  type: 'disease';
  data: {
    disease_prediction: string;
    prevention: string;
    explanation: string;
    tips: string[];
  };
  timestamp: Date;
}

export interface CSVPrediction {
  type: 'csv';
  data: {
    results: Array<{
      cow_id: number;
      predicted_yield: number;
      predicted_weekly_yield: number;
      disease_prediction: string;
      prevention: string;
      yield_explanation: string;
      disease_explanation: string;
    }>;
  };
  timestamp: Date;
}

export type PredictionResult = YieldPrediction | DiseasePrediction | CSVPrediction;

interface PredictionContextType {
  predictions: PredictionResult[];
  addYieldPrediction: (data: YieldPrediction['data']) => void;
  addDiseasePrediction: (data: DiseasePrediction['data']) => void;
  addCSVPrediction: (data: CSVPrediction['data']) => void;
  getLatestPrediction: () => PredictionResult | null;
  hasAnyPrediction: () => boolean;
  clearPredictions: () => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePredictionContext = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePredictionContext must be used within a PredictionProvider');
  }
  return context;
};

interface PredictionProviderProps {
  children: ReactNode;
}

export const PredictionProvider: React.FC<PredictionProviderProps> = ({ children }) => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const addYieldPrediction = (data: YieldPrediction['data']) => {
    const prediction: YieldPrediction = {
      type: 'yield',
      data,
      timestamp: new Date()
    };
    setPredictions(prev => [...prev, prediction]);
  };

  const addDiseasePrediction = (data: DiseasePrediction['data']) => {
    const prediction: DiseasePrediction = {
      type: 'disease',
      data,
      timestamp: new Date()
    };
    setPredictions(prev => [...prev, prediction]);
  };

  const addCSVPrediction = (data: CSVPrediction['data']) => {
    const prediction: CSVPrediction = {
      type: 'csv',
      data,
      timestamp: new Date()
    };
    setPredictions(prev => [...prev, prediction]);
  };

  const getLatestPrediction = (): PredictionResult | null => {
    if (predictions.length === 0) return null;
    return predictions[predictions.length - 1];
  };

  const hasAnyPrediction = (): boolean => {
    return predictions.length > 0;
  };

  const clearPredictions = () => {
    setPredictions([]);
  };

  const value: PredictionContextType = {
    predictions,
    addYieldPrediction,
    addDiseasePrediction,
    addCSVPrediction,
    getLatestPrediction,
    hasAnyPrediction,
    clearPredictions
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
