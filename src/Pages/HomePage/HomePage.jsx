import { DynamicNav, MainContainer } from '../../Layouts';
import { HomeHeader } from '../../Sections';
import { useDocumentTitle } from '../../Hooks';
import './HomePage.css';

const HomePage = () => {
  useDocumentTitle('Home Page');

  return (
    <>
      {/* <DynamicNav className={"homePageNav"} title={"الرئيسية"} /> */}
      <div className="PAGE homePage">
        <HomeHeader />
      </div>
    </>
  );
};

export default HomePage;

