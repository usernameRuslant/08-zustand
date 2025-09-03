'use client';

import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useRouter } from 'next/navigation';

import { NewNote } from '@/types/note';
import { useNoteDraftStore } from '@/lib/store/noteStore';

// import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
// import * as Yup from 'yup';

// interface FormValues {
//   title: string;
//   content: string;
//   tag: string;
// }
// interface NoteFormProps {
//   closeModal: () => void;
// }

// const ValidationSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, 'Title must be at least 3 characters')
//     .max(50, 'Title cannot exceed 50 characters')
//     .required(),

//   content: Yup.string().max(500, 'Content cannot exceed 500 characters'),

//   tag: Yup.string()
//     .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
//     .required(),
// });

const NoteForm = () =>
  // { closeModal }: NoteFormProps
  {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: createNote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notes'] });
        router.back();
        clearDraft();
        // closeModal();
      },
    });

    const { draft, setDraft, clearDraft } = useNoteDraftStore();

    const onSubmit = (formData: FormData) =>
      //   values: FormValues,
      //   actions: FormikHelpers<FormValues>
      // )
      {
        const values = Object.fromEntries(formData) as unknown as NewNote;

        mutation.mutate(values);
        //   actions.resetForm();
      };

    const onChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setDraft({
        ...draft,
        [e.target.name]: e.target.value,
      });
    };

    return (
      // <Formik
      //   validationSchema={ValidationSchema}
      //   initialValues={{ title: '', content: '', tag: 'Todo' }}
      //   onSubmit={onSubmit}
      // >
      //   {({ isValid, dirty, isSubmitting }) => (
      <form className={css.form} action={onSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            value={draft.title}
            onChange={onChange}
            id="title"
            type="text"
            name="title"
            className={css.input}
          />
          {/* <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              /> */}
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            value={draft.content}
            onChange={onChange}
            id="content"
            name="content"
            // rows={8}
            className={css.textarea}
          />
          {/* <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              /> */}
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            value={draft.tag}
            onChange={onChange}
            id="tag"
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
          {/* <ErrorMessage name="tag" component="span" className={css.error} /> */}
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => {
              router.back();
            }}
            // onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            // disabled={!isValid || !dirty || isSubmitting}
          >
            Create note
          </button>
        </div>
      </form>
    );
  };
// </Formik>
//   );
// };

export default NoteForm;
