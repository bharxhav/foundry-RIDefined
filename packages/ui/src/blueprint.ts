/**
 * Curated re-exports of Blueprint.
 *
 * Consumers deliberately do not depend on @blueprintjs/* themselves, so this is
 * the only door in. That keeps a single copy of Blueprint in the graph and gives
 * us one place to swap or wrap a component if Blueprint's API shifts.
 *
 * Every name here was verified against @blueprintjs/core's export barrel.
 */

export {
  BlueprintProvider,
  Button,
  ButtonGroup,
  Callout,
  Card,
  CardList,
  Classes,
  Code,
  Collapse,
  Divider,
  EntityTitle,
  FormGroup,
  H1,
  H2,
  H3,
  H5,
  HTMLTable,
  Icon,
  InputGroup,
  Intent,
  Link,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  NonIdealState,
  OL,
  PopoverAnimation,
  PopoverNext,
  Pre,
  ProgressBar,
  Section,
  SectionCard,
  SegmentedControl,
  Spinner,
  Switch,
  Tab,
  Tabs,
  Tag,
  TextArea,
  Tooltip,
  UL,
} from "@blueprintjs/core";

// Note the name: the barrel exports the Link *component's* props as
// LinkComponentProps, because LinkProps is already taken by an unrelated
// { href, target } interface in common/props. Importing LinkProps compiles but
// silently gives you the wrong, nearly empty type.
export type { LinkComponentProps, PopoverNextProps } from "@blueprintjs/core";

export type { IconName } from "@blueprintjs/icons";
