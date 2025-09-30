import { defineType } from 'sanity'

export default defineType({
  name: 'currency',
  title: 'Türk Lirası',
  type: 'object',
  fields: [
    {
      name: 'amount',
      title: 'Tutar (₺)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      description: 'Fiyatı girin (örn: 1000000)',
    },
  ],
  preview: {
    select: {
      amount: 'amount',
    },
    prepare(selection) {
      const { amount } = selection
      return {
        title: amount ? `${amount.toLocaleString('tr-TR')} ₺` : '0 ₺',
      }
    },
  },
})
