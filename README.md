## Aula 35 - Monitorando falhas na fila

Para poder ouvir os erros do processamento de jobs e obter um log, só alterar o código:

```
processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
}

handleFailure(job, err) {
 console.log(`Queue ${job.queue.name}: FAILED`, err);
}
```

Com isso a cada erro que acontecer podemos ver no log do servidor, posteriomente iremos mostrar de forma mais amigável.

Na documentação do bee-queue tem outros listeners também, de sucesso, etc.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula35](https://github.com/tgmarinho/gobarber/tree/aula35)
