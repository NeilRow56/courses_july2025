'use client'

import { TaskItem, TaskList } from '@tiptap/extension-list'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { MenuBar } from './MenuBar'

export const RichTextEditor = ({
  field
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],

    editorProps: {
      attributes: {
        class:
          'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none'
      }
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()))
    },
    content: field.value ? JSON.parse(field.value) : '<p>Hello World! 🚀</p>',
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false
  })

  return (
    <div className='border-input dark:bg-input/30 w-full overflow-hidden rounded-lg border'>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
