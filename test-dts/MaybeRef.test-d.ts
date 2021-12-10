import { expectType } from 'tsd'
import { Ref } from 'vue'

import { MaybeRef } from 'shared'

expectType<number | Ref<number>>({} as MaybeRef<number>)

expectType<number | Ref<number>>({} as MaybeRef<Ref<number>>)
