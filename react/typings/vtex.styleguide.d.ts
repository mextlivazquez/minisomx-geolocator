declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Spinner: ComponentType<SpinnerProps>
  export const Dropdown: ComponentType<DropdownProps>
  export const SelectableCard: ComponentType<SelectableCardProps>
  export const ButtonWithIcon: ComponentType<ButtonWithIconProps>
  export const InputSearch: ComponentType<InputSearchProps>
  export const Modal: ComponentType<ModalProps>

  interface InputProps {
    [key: string]: any
  }
}
