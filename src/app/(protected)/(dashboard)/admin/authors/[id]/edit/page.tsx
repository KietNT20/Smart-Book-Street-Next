import { AuthorForm } from '../../_components/author-form';

const EditPage = ({ params }: { params: { id: string } }) => {
  return <AuthorForm authorId={params.id} />;
};

export default EditPage;
