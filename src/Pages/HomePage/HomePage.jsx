import { DynamicNav, MainContainer } from '../../Layouts';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      {/* <DynamicNav className={"homePageNav"} title={"الرئيسية"} /> */}
      <MainContainer>
        <div className="PAGE homePage">
          <h1>هيرو سيكشن</h1>
        </div>
      </MainContainer>
    </>
  );
};

export default HomePage;

