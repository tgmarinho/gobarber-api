## Aula 31 - Cencelamento de agendamento

- Usuário só pode cancelar o agendamento se for duas horas antes do evento
- Criar uma rota delete appointment passando o id.
	- `routes.delete('/appointments/:id', AppointmentController.delete);`
- Criar o método delete no AppointmentController.js:
```
...
import { startOfHour, parseISO, isBefore, format } from  'date-fns';
...
...
async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // removo duas horas da data agendada
    const dateWithSub = subHours(appointment.date, 2);
    const NOW = new Date();
    if (isBefore(dateWithSub, NOW)) {
      return res.status(401).json({
        error: 'You can only cancel appointment 2 hours in advance.',
      });
    }

    appointment.canceled_at = NOW;

    await appointment.save();

    return res.json(appointment);
```

- Busco o appointment com o valor passando no query params com id do appointment
- Verifico se o usuário logado é dono do appointment
- Removo duas horas da data agendada, pois só pode cancelar o evento duas horas antes
- verifico se a hora appointment é antes da hora atual, se for envio mensagem de error
- Se não for continua o fluxo setando no canceled_at a data atual.
- Salvo o appointment e retorno para o usuário

Fim: [https://github.com/tgmarinho/gobarber/tree/aula31](https://github.com/tgmarinho/gobarber/tree/aula31)
