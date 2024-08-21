<script lang="ts">
  const greetings = {
    MORNING: 'Buenos días',
    AFTERNOON: 'Buenas tardes',
    NIGHT: 'Buenas noches',
  }

  const currentTime = new Date().getHours();

  let greeting = ''

  if (currentTime < 12) {
    greeting = greetings.MORNING
  } else if (currentTime < 18) {
    greeting = greetings.AFTERNOON
  } else {
    greeting = greetings.NIGHT
  }
</script>

<h1 class="text-4xl">{greeting}</h1>