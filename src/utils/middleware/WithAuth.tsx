import { useContext, useEffect, ReactElement, ComponentType } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";

export default function WithAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
): (props: P) => ReactElement | null {
  return function AuthenticatedComponent(props: P): ReactElement | null {
    const navigate: NavigateFunction = useNavigate();
    const { user, isAuthenticated, isLoading } = useContext(UserContext);

    useEffect((): void => {
      if (!isLoading && !isAuthenticated) {
        navigate("/auth");
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return <div>Chargement...</div>;
    }

    return isAuthenticated && user ? <WrappedComponent {...props} /> : null;
  };
}
