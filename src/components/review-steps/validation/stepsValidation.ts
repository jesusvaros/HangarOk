/**
 * Centralizado de validaciones para todos los pasos del formulario
 * Permite validar pasos desde diferentes puntos de la aplicación
 */

import { validateAndSubmitStep1 } from './Step1ValidationAndSubmit';
import type { AddressResult } from '../../ui/AddressAutocomplete';

// Interfaz para los estados y funciones requeridas para cada paso
interface StepValidationContext {
  // Paso 1 - Dirección
  step1?: {
    addressDetails: {
      street?: string;
      number?: string;
      floor?: string;
      door?: string;
      city?: string;
      postalCode?: string;
      state?: string;
      fullAddress?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      components?: {
        road?: string;
        house_number?: string;
        city?: string;
        town?: string;
        village?: string;
        postcode?: string;
        state?: string;
        [key: string]: string | undefined;
      };
    };
    addressResult?: AddressResult;
    setValidationError: (error: string | null) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setStreetError?: (hasError: boolean) => void;
    setNumberError?: (hasError: boolean) => void;
  };
  
  // Añadir más pasos aquí cuando se implementen
}

/**
 * Valida un paso específico del formulario y determina si puede continuar
 * @param stepNumber - Número de paso a validar (1-5)
 * @param context - Contexto con datos y funciones necesarias para validar
 * @returns Promise<boolean> - True si la validación es exitosa y puede avanzar
 */
export const validateStep = async (
  stepNumber: number, 
  context: StepValidationContext,
  onSuccess?: () => void
): Promise<boolean> => {
  try {
    // Valida según el número de paso
    // Variables comunes para los diferentes casos
    let isStepValid = false;
    let validationError: string | null = null;
    const setTempError = (error: string | null) => {
      validationError = error;
    };
    
    switch (stepNumber) {
      case 1:
        if (!context.step1) {
          console.error('Falta contexto para validar el paso 1');
          return false;
        }
        
        // Ejecuta la validación pero no la envía si hay errores
        await validateAndSubmitStep1({
          addressDetails: context.step1.addressDetails,
          addressResult: context.step1.addressResult,
          setValidationError: setTempError,
          setIsSubmitting: context.step1.setIsSubmitting,
          setStreetError: context.step1.setStreetError || (() => {}),
          setNumberError: context.step1.setNumberError || (() => {}),
          onNext: () => {
            isStepValid = true;
            if (onSuccess) onSuccess();
          }
        });
        
        // Si hay error, muéstralo en el componente
        if (validationError) {
          context.step1.setValidationError(validationError);
          return false;
        }
        
        return isStepValid;
        
      // Implementar más casos para los otros pasos cuando sea necesario
      default:
        // Para pasos no implementados, permitir navegación
        return true;
    }
  } catch (error) {
    console.error(`Error validando el paso ${stepNumber}:`, error);
    return false;
  }
};
