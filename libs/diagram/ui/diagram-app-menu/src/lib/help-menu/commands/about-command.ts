import {
  CommandItem,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';

export const aboutCommand = (mb: MenuBuilderService): CommandItem => {
  return mb.commandItem({
    label: 'About',
    exec: doAbout(),
  });
};

const doAbout = (): ((commandItem: CommandItem) => void) => {
  return () => {
    console.log('Help | About clicked');
  };
};
