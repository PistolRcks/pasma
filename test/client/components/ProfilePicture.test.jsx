import renderer from 'react-test-renderer';
import ProfilePicture from '../../../client/components/ProfilePicture.jsx';

it('displays a profile picture', () => {
  const component = renderer.create(
    <ProfilePicture username="jareddoran" />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  /*
  // manually trigger the callback
  renderer.act(() => {
    tree.props.onMouseEnter();
  });
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  renderer.act(() => {
    tree.props.onMouseLeave();
  });
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  */
});
