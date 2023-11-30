import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/user-slice";
import { USER_VERIFY } from "../../utils/constant";

const VerifiedPage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useSelector(selectUser);
  return user?.verify === USER_VERIFY.Verified ? <>{children}</> : <></>;
};

export default VerifiedPage;
