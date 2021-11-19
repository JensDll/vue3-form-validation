import { expectType } from 'tsd'
import { Ref } from 'vue'

import { MaybeRef } from 'vue3-form-validation/src/domain'

expectType<number | Ref<number>>({} as MaybeRef<number>)

expectType<number | Ref<number>>({} as MaybeRef<Ref<number>>)
