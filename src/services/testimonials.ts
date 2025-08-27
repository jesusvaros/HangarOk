export interface Testimonial {
  id: number;
  name: string;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'María G.',
    comment:
      'Gracias a Casero Verificado encontré un departamento con un casero confiable y sin sorpresas. ¡Totalmente recomendado!'
  },
  {
    id: 2,
    name: 'Luis R.',
    comment:
      'Pude compartir mi experiencia de forma anónima y ayudar a otros a evitar malos caseros. La plataforma es súper útil.'
  },
  {
    id: 3,
    name: 'Ana S.',
    comment:
      'Me encanta ver comentarios reales de otros inquilinos. Hace el proceso de búsqueda mucho más seguro.'
  }
];

export default testimonials;
