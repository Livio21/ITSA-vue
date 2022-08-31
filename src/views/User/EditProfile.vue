<template>
  <div>
    <form action="" class="mx-auto flex flex-col max-w-fit gap-10  bg-slate-200 p-10 sm:rounded-2xl shadow-lg"
      @submit.prevent="updateUser">
      <div class="max-w-fit self-center">

        <FileDrop id="dropZone" @drop.prevent="drop" @change="selectedFile" :pfpUrl="pfpUrl" :editable="edit" />
      </div>
      <div class="flex flex-col md:flex-row gap-3 ">
        <div class=" w-[350px] flex flex-col md:flex-row justify-between items-center">
          <label for="firstname">First Name: </label>
          <input type="text" name="firstname" :placeholder="userName[0]"
            class="ml-3 p-3 rounded-full ring ring-slate-100 text-center" :disabled="!edit"
            v-model="fullName.firstName">
        </div>
        <div class=" w-[350px] flex flex-col md:flex-row justify-between items-center">
          <label for="lastname">Last Name: </label>
          <input type="text" name="lastname" :placeholder="userName[1]"
            class="ml-3 p-3 rounded-full ring ring-slate-100 text-center" :disabled="!edit" v-model="fullName.lastName">
        </div>
      </div>
      <div class=" w-[350px] flex flex-col md:flex-row justify-between items-center">
        <label for="email" class="">Email: </label>
        <input type="email" name="email" :placeholder="userData.email"
          class="ml-3 p-3 rounded-full ring ring-slate-100 text-center" :disabled="!updateEmailandPass"
          v-model="userDetails.email" required>
      </div>
      <div class="flex  flex-col md:flex-row gap-3">
        <div class="w-[350px] flex flex-col md:flex-row justify-between items-center">
          <label for="password">Current Password: </label>
          <input type="password" name="password" placeholder="*********"
            class="ml-3 p-3 rounded-full ring ring-slate-100 text-center" :disabled="!updateEmailandPass"
            v-model="cpassword[0]" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
            required>

        </div>
        <div class=" w-[350px] flex flex-col md:flex-row justify-between items-center" v-if="edit">
          <label for="cpassword">New Password: </label>
          <input type="password" name="cpassword" placeholder="*********"
            class="ml-3 p-3 rounded-full ring ring-slate-100 text-center" :disabled="!updateEmailandPass"
            v-model="cpassword[1]" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
            required>

        </div>
      </div>
      <div class="flex flex-col md:flex-row  gap-5 justify-center md:justify-end">
        <div v-if="edit" class="inline p-3">
          <label for="default-toggle" class="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" value="" id="default-toggle" class="sr-only peer" v-model="updateEmailandPass">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
            </div>
            <span class="ml-3  font-medium text-black ">Update Email and Password?</span>
          </label>
        </div>
        <button type="submit"
          class="w-[100px] h-[50px] bg-green-500 rounded-full text-white font-semibold  hover:bg-green-400 active:bg-green-600 active:scale-95"
          :class="{ ' bg-gray-500': !isUploaded }" v-if="edit" :disabled="!isUploaded">
          <span v-if="!isUploaded" class="material-symbols-outlined animate-spin">
            hourglass_top
          </span>
          <span v-if="isUploaded">Save</span>

        </button>
        <button type="button"
          class="w-[100px] h-[50px] bg-red-500 rounded-full text-white font-semibold hover:bg-red-400 active:bg-red-600 active:scale-95"
          @click="toggleEdit">Edit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { profilePicture } from "@/firebase";
import { useStore } from "vuex";
import FileDrop from "@/components/fileDrop.vue";
import { reauthenticateWithCredential, EmailAuthProvider } from "@firebase/auth";
export default {
  setup() {
    const store = useStore();
    const userData = store.state.user;
    console.log();
    const fullName = ref({})

    const userDetails = ref({});
    const userName = userData.displayName.split(' ')
    const edit = ref(false)
    const updateEmailandPass = ref(false)
    const isUploaded = ref(true)

    const pfpUrl = ref('')
    const cpassword = ref([])

    // const test = () => {
    //   const credential = promptForCredentials();
    //   reauthenticateWithCredential(userData, credential).then(() => {
    //     // User re-authenticated.
    //   }).catch((error) => {
    //     alert(error);
    //     // An error ocurred
    //     // ...
    //   });
    // }
    const toggleEdit = () => {
      edit.value = !edit.value
    }
    let dropzoneFile = ref({})
    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0]
      handleFileUpload(userData.uid)
    }
    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0]
      handleFileUpload(userData.uid)
    }

    const handleFileUpload = async (id) => {
      if (dropzoneFile.value && id) {
        isUploaded.value = false
        await uploadBytes(profilePicture(dropzoneFile.value.name, id), dropzoneFile.value).then(() => {
          getDownloadURL(profilePicture(dropzoneFile.value.name, id)).then((url) => {
            userDetails.value.photoURL = url
            pfpUrl.value = url
            isUploaded.value = true
          }).catch((err) => {
            console.log(err.message, 'error getting the img url');
          })
          console.log("Uploaded a file!");
          console.log(dropzoneFile.value.name);
        })
      }
    };
    const reauth = (currentPassword) => {
      const cred = EmailAuthProvider.credential(userData.email, currentPassword)
      return reauthenticateWithCredential(userData, cred)
    }
    const updateUser = () => {
      if (userDetails.value) {
        if (updateEmailandPass.value == true) {
          reauth(cpassword.value[0]).then(() => {
            cpassword.value[1] = userDetails.value.password
            console.log(cpassword.value);
            store.dispatch("updateUserEmail", userDetails.value);
            store.dispatch("updatePass", userDetails.value);
          }).catch((error) => {
            alert(error);
          })
        } else {
          if (fullName.value.firstName != undefined && fullName.value.lastName != undefined) {
            console.log(fullName.value);
            userDetails.value.displayName = fullName.value.firstName + ' ' + fullName.value.lastName
            if (userDetails.value.photoURL) {
              console.log(userDetails.value);
              store.dispatch("updateUser", userDetails.value);
            } else {
              userDetails.value.photoURL = userData.photoURL
              console.log(userDetails.value);
              store.dispatch("updateUser", userDetails.value);
            }
          } else {
            userDetails.value.displayName = userData.displayName;
            console.log(userDetails.value.displayName);
            store.dispatch("updateUser", userDetails.value);
          }
        }
      }
      // store.dispatch("updateUser", userDetails.value);
      // store.dispatch("updateUserEmail", userDetails.value);
      // store.dispatch("updatePass", userDetails.value);
    };
    const clipboardF = () => {
      const uid = userData.uid;
      navigator.clipboard.writeText(uid);
      alert("Copied succesfully!");
    };
    onMounted(() => { pfpUrl.value = userData.photoURL });
    return {
      store,
      userData,
      userDetails,
      clipboardF,
      updateUser,
      handleFileUpload,
      selectedFile,
      dropzoneFile,
      drop,
      userName,
      edit,
      toggleEdit,
      pfpUrl,
      fullName,
      cpassword,
      isUploaded,
      updateEmailandPass,
      reauth
    };
  },
  methods: {},
  components: { FileDrop }
};
</script>

<style lang="scss" scoped>
.editForm {
  input {
    padding: 10px;
    border-radius: 5px;
  }
}
</style>
