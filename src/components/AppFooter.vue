<template>
  <footer class="border-t border-line bg-soft">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-muted sm:px-6 lg:px-8"
    >
      <p class="font-semibold text-heading">Roamly</p>
      <p>
        Weather &amp; geocoding by
        <a class="text-primary underline" href="https://open-meteo.com/"
          >Open-Meteo</a
        >. Maps ©
        <a
          class="text-primary underline"
          href="https://www.openstreetmap.org/copyright"
          >OpenStreetMap</a
        >
        contributors.
      </p>
      <p>
        Photos from
        <a
          class="text-primary underline"
          href="https://unsplash.com/?utm_source=roamly&utm_medium=referral"
          >Unsplash</a
        >.
      </p>
      <p>
        Favorites and trips are stored locally in this browser. ©
        {{ new Date().getFullYear() }} Roamly.
      </p>
    </div>
  </footer>
</template>
