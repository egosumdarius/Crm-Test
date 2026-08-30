export interface EmailTemplate {
  id: string;
  name: string;
  category: 'prospeccion' | 'propuesta' | 'seguimiento' | 'cierre' | 'onboarding';
  subject: string;
  body: string;
  description: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'propuesta-tecnica',
    name: 'Envío de Propuesta Técnica y Económica',
    category: 'propuesta',
    description: 'Acompañamiento formal de propuesta con resumen ejecutivo y siguientes pasos.',
    subject: 'Propuesta de Consultoría: {servicio} | {empresa} & Consultoría Estratégica',
    body: `Estimado/a {nombre},

Un gusto saludarte. Tras nuestra última sesión de trabajo y el análisis preliminar de las necesidades de {empresa}, me complace compartirte formalmente la Propuesta de Consultoría en {servicio}.

En el documento adjunto detallamos:
1. Diagnóstico del estado actual y oportunidades detectadas.
2. Alcance del proyecto, metodología y entregables clave por fase.
3. Cronograma estimado de ejecución y equipo consultor asignado.
4. Esquema de inversión y condiciones comerciales.

Nos encantaría agendar una breve sesión de 25 minutos para resolver dudas con tu equipo directivo y coordinar los siguientes pasos.

¿Qué día de esta semana te resultaría más conveniente? También puedes seleccionar el horario que mejor te acomode en mi calendario: {enlace_calendario}

Quedo a tu entera disposición.

Atentamente,
{consultor}
Director de Consultoría`
  },
  {
    id: 'seguimiento-reunion',
    name: 'Minuta y Acuerdos tras Sesión de Diagnóstico',
    category: 'seguimiento',
    description: 'Resumen ejecutivo con compromisos y fecha de entrega de propuesta.',
    subject: 'Resumen y Siguientes Pasos - Sesión de Diagnóstico con {empresa}',
    body: `Hola {nombre},

Muchas gracias por el tiempo compartido en nuestra sesión de hoy. Ha sido muy enriquecedor conocer a fondo los objetivos estratégicos y retos actuales de {empresa}.

Principales puntos acordados:
• Objetivo prioritario: Optimización de {servicio} y reducción de cuellos de botella operativos.
• Plazo proyectado: Inicio sugerido para el próximo mes.
• Nuestro compromiso: Preparar el roadmap estratégico y la propuesta de trabajo antes del viernes.

Adjuntaremos la propuesta detallada en los próximos días. Si surge cualquier punto adicional que consideres relevante incluir, no dudes en escribirme.

Un cordial saludo,
{consultor}`
  },
  {
    id: 'primer-contacto-discovery',
    name: 'Invitación a Sesión Inicial de Descubrimiento',
    category: 'prospeccion',
    description: 'Propuesta de call de 20 minutos para evaluar fit de consultoría.',
    subject: 'Oportunidad de colaboración estratégica en {servicio} para {empresa}',
    body: `Estimado/a {nombre},

He estado siguiendo de cerca el crecimiento de {empresa} y su liderazgo en el sector. En nuestra firma de consultoría ayudamos a organizaciones similares a escalar sus operaciones y maximizar su rentabilidad a través de {servicio}.

Nos gustaría ofrecerles una sesión de diagnóstico preliminar de 20 minutos sin costo, donde compartiremos 3 palancas de mejora y benchmarks recientes del sector.

Puedes reservar directamente en mi agenda compartida:
{enlace_calendario}

¿Te parece bien coordinar una llamada esta semana?

Saludos cordiales,
{consultor}`
  },
  {
    id: 'seguimiento-cierre',
    name: 'Seguimiento de Propuesta y Revisión de Términos',
    category: 'cierre',
    description: 'Email de seguimiento respetuoso cuando la propuesta ya fue enviada.',
    subject: 'Seguimiento a propuesta de {servicio} para {empresa}',
    body: `Hola {nombre},

Espero que estés teniendo una excelente semana.

Quería consultar si tuviste oportunidad de revisar con el equipo la propuesta de consultoría que te enviamos sobre {servicio}. 

Estamos cerrando el calendario de asignación de consultores senior para el próximo mes y nos gustaría asegurar la disponibilidad prioritaria para el proyecto de {empresa}.

¿Tienen alguna consulta sobre el alcance o les gustaría que ajustemos algún hito del cronograma?

Quedo atento a tus comentarios.

Un cordial saludo,
{consultor}`
  },
  {
    id: 'kickoff-onboarding',
    name: 'Bienvenida y Kick-off del Proyecto',
    category: 'onboarding',
    description: 'Instrucciones para inicio de consultoría tras cerrar el contrato.',
    subject: '¡Bienvenidos! Próximos pasos y Kick-off del proyecto con {empresa}',
    body: `Estimado/a {nombre} y equipo de {empresa},

¡Es un gran honor comenzar a trabajar juntos en este proyecto de {servicio}!

Para asegurar un arranque fluido y eficiente, hemos agendado la sesión de Kick-off para los próximos días. En dicha sesión presentaremos a los consultores líderes asignados y validaremos el plan de trabajo de las primeras 4 semanas.

Requerimientos iniciales para la sesión:
1. Acceso a documentación interna preliminar (organigrama y procesos clave).
2. Confirmación de los líderes de área que participarán en las entrevistas de diagnóstico.

Enlace a la sesión virtual: {enlace_calendario}

¡Estamos muy entusiasmados por los resultados que construiremos juntos!

Saludos cordiales,
{consultor}`
  }
];
