import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import Input from '../src/components/Input'

describe('Input', () => {
  it('renders correctly and checks interaction', () => {
    const handleChange = jest.fn() // モック関数を作成
    const title = 'Username'
    const elementName = 'username'

    render(
      <Input title={title} elementName={elementName} onChange={handleChange} />,
    )

    // レンダリングされたラベルのテキストを検証
    expect(screen.getByLabelText(title)).toBeInTheDocument()

    // input要素が存在することを確認
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()

    // input要素のidがelementNameと一致するか確認
    expect(input).toHaveAttribute('id', elementName)

    // input要素にテキストを入力して、onChangeイベントが発生するか確認
    fireEvent.change(input, { target: { value: 'test user' } })
    expect(handleChange).toHaveBeenCalled()
  })
})
