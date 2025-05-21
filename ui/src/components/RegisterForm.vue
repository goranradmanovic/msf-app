<template>
  <div class="wrapper__content">
    <Transition>
      <Card class="shadow-2">
        <template v-if="step === 1" #title>Create your account</template>
        <template #content>
          <Form ref="formRef" :initialValues :resolver @submit="onFormSubmit" :validateOnBlur="true" class="flex flex-column flex-col gap-4 w-full sm:w-80 mt-4 mb-4">
            <div v-show="step === 1 && !formSuccess" class="d-flex flex-column flex-col gap-4 w-full sm:w-80 step-1">
              <div>
                <Select v-model="initialValues.country" name="country" :options="countries" filter optionLabel="name" placeholder="Select a Country" class="w-full md:w-56" size="medium">
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex items-center">
                        <img :alt="slotProps.value.label" :src="`https://flagcdn.com/${slotProps.value.code?.toLowerCase()}.svg`" :class="`mr-2 flag flag-${slotProps.value.code?.toLowerCase()}`" style="width: 2rem; height: 1.4rem;" />
                        <div>{{ slotProps.value.name }}</div>
                      </div>
                      <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                      <div class="flex items-center">
                        <img :alt="slotProps.option.label" :src="`https://flagcdn.com/${slotProps.option.code?.toLowerCase()}.svg`" :class="`mr-2 flag flag-${slotProps.option.code?.toLowerCase()}`" style="width: 2rem; height: 1.4rem;" />
                        <div>{{ slotProps.option.name }}</div>
                      </div>
                    </template>
                </Select>
                <FormField v-slot="$field" name="country" initialValue="">
                  <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
                </FormField>
              </div>
              <FormField v-slot="$field" name="email" initialValue="" class="flex flex-column flex-col gap-1 w-full">
                <InputText v-model="initialValues.email" type="text" placeholder="Email" class="w-full" size="large" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="password" initialValue="" class="flex flex-column flex-col gap-1">
                <Password v-model="initialValues.password" type="text" placeholder="Password" :feedback="false" toggleMask fluid class="w-full" size="large" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>

              <Button @click="nextStep" :disabled="disabledContinueBtn" type="button" label="Continue" size="large" class="btn__continue border-0" />
            </div>
            <div v-show="step === 2 && !formSuccess" class="d-flex flex-column flex-col gap-4 w-full sm:w-80 step-2">
              <FormField v-slot="$field" name="firstName" initialValue="" class="flex flex-column flex-col gap-1">
                <InputText v-model="initialValues.firstName" type="text" size="large" placeholder="First Name" class="w-full" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="lastName" initialValue="" class="flex flex-column flex-col gap-1">
                <InputText v-model="initialValues.lastName" type="text"size="large" placeholder="Last Name" class="w-full" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="phone" initialValue="" class="relative flex flex-column flex-col gap-1">
                <InputText v-model="initialValues.phone" id="phone" type="tel" size="large" placeholder="Phone number" class="pl-6 w-full" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>

              <div class="flex flex-col gap-4 w-full sm:w-80">
                <Button icon="pi pi-arrow-left" @click="prevStep" type="button" severity="secondary" aria-label="Back" size="large" />
                <Button type="submit" severity="secondary" :loading="loading" :disabled="disabledSubmitBtn" label="Complete" size="large" class="w-full bg-blue-600 text-white" />
              </div>
            </div>
          </Form>

          <div v-show="formSuccess" class="d-flex flex-column justify-content-center align-items-center text-center step-3">
            <img src="@/assets/images/user.svg" alt="User image" class="flex w-1" />
            <h2 class="mt-3">Registration successful</h2>
            <p>We are creating your account...</p>
          </div>
        </template>

        <template #footer>
          <div class="text-center text-sm card__footer">
            <div v-if="step === 1 && !formSuccess">
              <p>Already have an account? <a href="#" class="font-semibold no-underline">Login</a></p>
              <div class="text-center text-sm cta__link mt-4">
                <a href="#" class="font-semibold no-underline">Open Corporate Account</a>
              </div>
            </div>
            <p v-else-if="step === 2 && !formSuccess">By creating an account, I confirm that I am 18+ years old and accept the Terms and Conditions, the Partnership Agreement Terms & Conditions, and the Partnership Agreement Appendix A.</p>
          </div>
        </template>
      </Card>
    </Transition>
  </div>
</template>

<script setup>
  import { yupResolver } from '@primevue/forms/resolvers/yup'
  import * as yup from 'yup'
  import { ref, reactive, computed, watch } from 'vue'
  import { Form, FormField } from '@primevue/forms'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import Button from 'primevue/button'
  import Password from 'primevue/password'
  import Card from 'primevue/card'
  import Message from 'primevue/message'

  const step = ref(1),
    formRef = ref(),
    disabledContinueBtn = ref(true),
    disabledSubmitBtn = ref(true),
    formSuccess = ref(false),
    loading = ref(false),
    initialValues = reactive({
      country: null,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: ''
    }),
    countries = ref([
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' }
    ])

  const stepOneSchema = yup.object({
    country: yup.object({ code: yup.string(), name: yup.string() }).required('Country is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required').min(9, 'Password must be at least 9 characters')
      .matches(/[0-9]/, 'Must include a number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include a special character')
      .matches(/[A-Z]/, 'Must include an uppercase letter')
      .matches(/[a-z]/, 'Must include a lowercase letter'),
  })

  const stepTwoSchema = yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    phone: yup.string().required('Phone number is required')
      .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number must be valid'),
  })

  const resolver = computed(() => yupResolver(step.value === 1 ? stepOneSchema : stepTwoSchema))

  const validateStepOne = async () => {
    try {
      await stepOneSchema.validate({
        country: initialValues.country,
        email: initialValues.email,
        password: initialValues.password
      }, { abortEarly: false })
      return true
    } catch (err) {
      return false
    }
  }

  watch(() => [initialValues.country, initialValues.email, initialValues.password],
    async () => {
      const isValid = await validateStepOne()
      disabledContinueBtn.value = !isValid
    },
    { deep: true }
  )

  const validateStepTwo = async () => {
    try {
      await stepTwoSchema.validate({
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        phone: initialValues.phone
      }, { abortEarly: false })
      return true
    } catch (err) {
      return false
    }
  };

  watch(() => [initialValues.firstName, initialValues.lastName, initialValues.phone],
    async () => {
      const isValid = await validateStepTwo()
      disabledSubmitBtn.value = !isValid
    },
    { deep: true }
  )

  const nextStep = async () => {
    const result = await formRef.value?.validate()

    if (result?.values) {
      const { country, email, password } = result.values

      if (country.code && country.name && email && password) step.value = 2
    }
  }

  const prevStep = () => step.value = 1

  const onFormSubmit = async ({ valid }) => {
    if (valid) {
      loading.value = true
      const settings = {
        method: 'POST',
        body: JSON.stringify(initialValues),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }

      try {
        const fetchResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/new`, settings),
          data = await fetchResponse.json()

        if (data?.success) {
          formSuccess.value = true
          disabledContinueBtn.value = true
          disabledSubmitBtn.value = true
          formRef.value.reset()
          loading.value = false
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
</script>