## Aula 23 - Validações de agendamento

- Validar se a data de agendamento é uma data futura
- Validar se a data de agendamento já está ocupada para o mesmo prestador de serviço
- Permitir agendar de hora em hora
- Utilizar a [DateFNS](https://date-fns.org/)) pra lidar com datas
	- Para instalar: `yarn add date-fns@next`
	- `import { startOfHour, parseISO } from  'date-fns';`
	- `parseISO` transforma `"2019-10-01T18:00:00-04:00"` em Objeto data do JS
	- `startOfHour` despreza os minutos e segundos, e retorna apenas da hora. 18h35 fica apenas 18h.
	- `isBefore(x,y)` verifica se a data do primeiro parametro é anterior a do segundo parametro
- Não permitir agendamento duplicado para o o prestador na mesma hora.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula23](https://github.com/tgmarinho/gobarber/tree/aula23)
