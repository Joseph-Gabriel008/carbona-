import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CalculatorClient from '@/app/calculator/CalculatorClient';
import { useCarbonaStore } from '@/lib/store';

describe('CalculatorClient and Zustand Store Integration', () => {
  beforeEach(() => {
    const { resetState } = useCarbonaStore.getState();
    act(() => {
      resetState();
    });
  });

  test('walks through all 4 steps of calculator and updates the Zustand store', () => {
    render(<CalculatorClient />);

    // --- STEP 1: Transportation ---
    // Select Petrol engine
    const petrolText = screen.getByText('Petrol (Gasoline)');
    const petrolButton = petrolText.closest('button');
    expect(petrolButton).toBeInTheDocument(); // Assertion 1
    if (petrolButton) {
      fireEvent.click(petrolButton);
    }

    // Set Car Travel km
    const carKmInput = screen.getByLabelText(/car travel/i);
    fireEvent.change(carKmInput, { target: { value: '800' } });

    // Set Transit km
    const transitInput = screen.getByLabelText(/bus \/ train/i);
    fireEvent.change(transitInput, { target: { value: '200' } });

    // Set Flight hours
    const flightInput = screen.getByLabelText(/aviation \/ flights/i);
    fireEvent.change(flightInput, { target: { value: '10' } });

    // Click Next Step
    const nextButton1 = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton1);

    // --- STEP 2: Energy ---
    // Verify we are on Step 2 by checking heating utility label presence
    expect(screen.getByText(/home heating utility source/i)).toBeInTheDocument(); // Assertion 2

    // Set Electricity kWh
    const elecInput = screen.getByLabelText(/electricity load/i);
    fireEvent.change(elecInput, { target: { value: '300' } });

    // Set AC Hours
    const acInput = screen.getByLabelText(/air conditioning/i);
    fireEvent.change(acInput, { target: { value: '5' } });

    // Click Next Step
    const nextButton2 = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton2);

    // --- STEP 3: Food ---
    // Select Vegetarian diet
    const vegText = screen.getByText('Vegetarian');
    const vegButton = vegText.closest('button');
    if (vegButton) {
      fireEvent.click(vegButton);
    }

    // Click Next Step
    const nextButton3 = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextButton3);

    // --- STEP 4: Shopping ---
    // Set clothes count
    const clothesInput = screen.getByLabelText(/new clothes purchased/i);
    fireEvent.change(clothesInput, { target: { value: '3' } });

    // Set electronics count
    const elecDevicesInput = screen.getByLabelText(/electronics purchased/i);
    fireEvent.change(elecDevicesInput, { target: { value: '1' } });

    // Click Generate Twin
    const generateButton = screen.getByRole('button', { name: /generate twin/i });
    expect(generateButton).toBeInTheDocument(); // Assertion 3
    fireEvent.click(generateButton);

    // Verify store state has updated calculator outputs
    const storeState = useCarbonaStore.getState();
    expect(storeState.hasData).toBe(true); // Assertion 4
    expect(storeState.emissions.transportation).toBeGreaterThan(0); // Assertion 5
    expect(storeState.emissions.energy).toBeGreaterThan(0); // Assertion 6
    expect(storeState.emissions.food).toBeGreaterThan(0); // Assertion 7
    expect(storeState.emissions.shopping).toBeGreaterThan(0); // Assertion 8
    expect(storeState.calculatorInputs.carKm).toBe(800); // Assertion 9
    expect(storeState.calculatorInputs.electricityKwh).toBe(300); // Assertion 10
  });
});
