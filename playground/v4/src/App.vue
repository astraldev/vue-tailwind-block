<tailwind lang="yaml">
# Tailwind v4 in YAML. Every entry is turned into a string before parsing,
# so nothing needs quoting. Only " #" still starts a comment.
base:
  root:
    - mx-auto mt-10 max-w-md rounded-xl border p-6
    - bg-(--brand)/10
    - @container
  title:
    - text-xl font-semibold text-(--brand)
    - @sm:text-3xl
  list:
    - mt-4 flex flex-col gap-2
    - *:rounded-md
    - *:bg-white
  item:
    - flex justify-between px-3 py-2 shadow-sm
    - [&:hover]:bg-yellow-100
    - hover:font-bold [&>b]:underline   # [ in the middle is fine
  badge:
    - rounded-full bg-(--brand) px-2 text-sm text-white
    - w-[calc(100%-1rem)] max-w-12 text-center   # arbitrary values are fine
  button:
    - mt-4 rounded bg-slate-900 px-4 py-2 text-white
    - hover:bg-slate-700!
    - [--tone:0.5]
# Not supported once everything is a string:
#   a #b        " #" starts a comment and cuts the rest of the entry
#   [a, b]      yaml flow lists, anchors, aliases and merge keys stay plain text
</tailwind>

<script setup>
const examples = ['Plain entries', 'Quoted entries', 'Arbitrary values']
</script>

<template>
  <section :class="[classes.base.root]">
    <h1 :class="[classes.base.title]">Tailwind v4 in YAML</h1>
    <ul :class="[classes.base.list]">
      <li v-for="example in examples" :key="example" :class="[classes.base.item]">
        <b>{{ example }}</b>
        <span :class="[classes.base.badge]">ok</span>
      </li>
    </ul>
    <button :class="[classes.base.button]">Hover me</button>
  </section>
</template>
