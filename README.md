## Aula 24 - Listando agendamentos do usuário

Mostrar todos os agendamentos do usuário logado e mostrar seus prestadores de serviços

- Criar nova rota com método get no `routes.js` para o AppointmentController no método index.
- Buscando todos os agendamentos do usuário logado, que não estão cancelados, tranzendo o usuário provider, prestador de serviço com o seu avatar. Ordenado por data, trazendo apenas os atributos id e data do agendamento.

```
class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }
```
Fim: [https://github.com/tgmarinho/gobarber/tree/aula24](https://github.com/tgmarinho/gobarber/tree/aula24)
