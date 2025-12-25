import { $planillas } from '../store/planillas';

const unbindListener = $planillas.subscribe((value, oldValue) => {
  console.log(`counter value changed from ${oldValue} to ${value}`)
});

document.addEventListener('DOMContentLoaded', () => {
  const planillasList = document.getElementById('planillas-list');

});