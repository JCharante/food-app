// Source: https://dev.to/vinipachecov/how-to-use-svg-files-in-react-native-with-typescript-1bn7
// Reason: https://blog.logrocket.com/how-to-use-svgs-react-native-tutorial-with-examples/
declare module "*.svg" {
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}