import { getTodayDate, getDateOffset } from "./utils/utils"

export const RESTAURANTS = [
  {
    id: 'maison-lumi',
    name: 'Maison Lumi',
    cuisine: 'French',
    price: '$$$$',
    slots: ['6:00 pm', '7:30 pm', '9:00 pm'],
    availableDates: [getTodayDate(), getDateOffset(1), getDateOffset(2), getDateOffset(5)],
  },
  {
    id: 'fiamma-verde',
    name: 'Fiamma Verde',
    cuisine: 'Italian',
    price: '$$$',
    slots: ['5:30 pm', '7:00 pm', '8:30 pm'],
    availableDates: [getTodayDate(), getDateOffset(3), getDateOffset(4), getDateOffset(6)],
  },
  {
    id: 'umami-lab',
    name: 'Umami Lab',
    cuisine: 'Japanese',
    price: '$$$',
    slots: ['6:30 pm', '8:00 pm'],
    availableDates: [getDateOffset(1), getDateOffset(2), getDateOffset(4), getDateOffset(7)],
  },
  {
    id: 'casa-del-sol',
    name: 'Casa del Sol',
    cuisine: 'Mexican',
    price: '$$',
    slots: ['5:00 pm', '6:30 pm', '8:00 pm', '9:30 pm'],
    availableDates: [getTodayDate(), getDateOffset(1), getDateOffset(5), getDateOffset(6)],
  },
]