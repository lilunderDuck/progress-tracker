type Primitive = string | number | boolean | bigint | symbol | undefined | null

/**Helper type to determine the path for a specific property value. */
type BuildPath<Key extends string, Value> = 
  Value extends Array<any> ? Key : 
    Value extends object ? Key | `${Key}.${PathKeys<Value>}` : Key
// ...

/**Generates a union of all dot-notation paths in an object. 
 * 
 * Basically, it just convert `object` into `object.property.more_prop`
 */
export type PathKeys<T> = T extends Primitive
  ? never
  : {
      [Key in keyof T & string]: BuildPath<Key, NonNullable<T[Key]>>
    }[keyof T & string]
// ...

/**Extracts the type sitting at the end of a dot-notation path. 
 * 
 * Basically, I give `object.property`, this spills out the type of that.
 */
export type PathValue<T, P extends string> = 
  P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T ? 
      PathValue<NonNullable<T[Key]>, Rest> : 
      never
    : P extends keyof T
    ? T[P]
    : never
// ...

export type SupportedInputEvent<T extends any = any> = { currentTarget: { value?: T } }
export type BaseOnChangeHandler<T extends any> = {
  onChange$(value: T): any
}

/**Do you like the "object key path just auto-completed for me by just Ctrl + Space-ing?".
 * Looks no futher! This hook helps to retain a value in a form when component unmount/remount.
 * 
 * This is handy when you have a form component that switch often, like a tab for each steps
 * of the form.
 * 
 * **Notes**: this should be used inside your provider component, example:
 * ```tsx
 * function FormProvider(props: ParentProps) {
 *   return (
 *     <Context.Provider value={{
 *       retainer: createFormValueRetainer<YourFormSchema>()
 *       // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *     }}>
 *       {props.children}
 *     </Context.Provider>
 *   )
 * }
 * ```
 * 
 * Don't worry, I only take like less than 1 and a half hours to write this. 
 * (1 and a half hours ~= 1 super eurobeat mix)
 * 
 * @example
 * ```tsx
 * // define your form schema somewhere...
 * type Schema = {
 *   name: string
 *   description?: string
 *   setting: {
 *     darkMode: boolean
 *   }
 * }
 * 
 * const retainer = createFormValueRetainer<Schema>()
 * 
 * // retain a value in a <input />
 * <input {...retainer.retain$('name')} type="text" placeholder="Enter your name" />
 * // if your component has a "value" and "onInput" props too, it will also works.
 * // also, the property dot syntax will autocomplete for you if you press Ctrl + Space.
 * <YourInputComponent {...retainer.retain$('setting.darkMode')} />
 * 
 * // to get the data back, use getData$()
 * console.log(retainer.getData$())
 * ```
 * @see {@link SupportedInputEvent}
 * @see {@link PathKeys}
 * @see {@link PathValue}
 * @returns 
 */
export function createFormValueRetainer<Schema extends object>() {
  let cache = new Map<string, any>()

  return {
    retain$<K extends PathKeys<Schema>>(
      key: K,
      defaultValue?: NonNullable<PathValue<Schema, K>>
    ) {
      if (!cache.has(key) && defaultValue !== undefined) {
        cache.set(key, defaultValue)
      }

      const currentValue = cache.get(key) as PathValue<Schema, K> | undefined
      console.log("createFormValueRetainer(): restored value:", currentValue, "of type", typeof currentValue)

      return {
        value: currentValue,
        onChange$: (value: any) => {
          cache.set(key, value)
          console.log("createFormValueRetainer(): value has been retained:", value, "of type", typeof value)
        }
      }
    },
    getData$(): Schema {
      const result = {} as any
      // god, please help me
      for (const [flatPath, value] of cache.entries()) {
        const parts = flatPath.split('.')
        let current = result

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i]
          if (i === parts.length - 1) {
            current[part] = value
          } else {
            current[part] = current[part] || {}
            current = current[part]
          }
        }
      }

      console.log("createFormValueRetainer(): data from cache is", result)

      return result as Schema
    }
  }
}

export type FormValueRetainer<Schema extends object> = ReturnType<typeof createFormValueRetainer<Schema>>