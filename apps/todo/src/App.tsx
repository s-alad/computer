import * as stylex from '@stylexjs/stylex'
import { fonts } from '@salad/fonts/fonts.stylex'
import { Input } from '@salad/ui/input'

const styles = stylex.create({
  title: { fontFamily: fonts.display, fontSize: '2rem', margin: 0 },
})

function App() {
  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h1 {...stylex.props(styles.title)}>todo</h1>
      <Input placeholder="placeholder" />
    </div>
  )
}

export default App
