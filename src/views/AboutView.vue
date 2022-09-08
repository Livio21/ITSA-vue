<template>
  <div class="about w-full h-full relative">
    <div class="max-w-6xl mx-auto grid justify-center">
      <div class="font-semibold text-slate-700 w-fit">
        <h1 class="text-6xl ">ITSA System</h1>
        <h2 class="test text-2xl ">Interactive Teaching and Student Assesment System</h2>
      </div><br>
      <div class=" font-semibold text-slate-700">
        <h2>Created by <a target="_blank" href="https://github.com/Livio21"
            class=" bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-2xl transition-all active:text-xl">
            Livio Macaj</a> for the Bachelor's Diploma Theisis.</h2>
      </div>
      <div class=" font-semibold text-slate-700">
        <h2>Developed on <a target="_blank" href="https://vuejs.org/"
            class="hover:text-green-500 hover:text-2xl transition-all active:text-xl">
            VueJS</a> front-end framework.</h2>
        <h2><a target="_blank" href="https://firebase.google.com/"
            class="hover:text-yellow-500 hover:text-2xl transition-all active:text-xl">
            Firebase</a> for back-end & Firestore for file management.</h2>
        <h2><a target="_blank" href=" https://tailwindcss.com/"
            class="hover:text-blue-500 hover:text-2xl transition-all active:text-xl">
            Tailwind CSS</a> for styling.</h2>
        <h2><a target="_blank" href=" https://cit.edu.al/" class="hover:text-red-500 hover:text-2xl transition-all active:text-xl">
            CIT</a> @2022</h2>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.about {
  display: inline-block;

  h1 {
    overflow: hidden;
    white-space: nowrap;
    border-right: .05em solid black;
    animation:
      typing 3s forwards,
      blinkBorder .75s step-end infinite;
    width: 0;
  }

  h2 {
    overflow: hidden;
    white-space: nowrap;

    animation:
      typing 5s forwards;
    width: 0;
  }

  @keyframes typing {
    from {
      width: 0
    }

    to {
      width: 100%
    }
  }

  @keyframes blinkBorder {

    from,
    to {
      border-color: transparent
    }

    50% {
      border-color: black;
    }
  }
}
</style>
