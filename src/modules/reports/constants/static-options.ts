import { selectOption } from '@/models/common';

const year: selectOption[] = [];
const currentYear = new Date().getFullYear();

for (let i = 2005; i <= currentYear; i += 1) {
  year.push({
    value: i,
    label: `${i}`
  });
}

const currentYearOption: selectOption = {
  value: currentYear,
  label: `${currentYear}`
};

export { year, currentYearOption };
