import { DynamicNav, MainContainer } from '../../Layouts';
import { HomeHeader } from '../../Sections';
import './HomePage.css';

const HomePage = () => {
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

