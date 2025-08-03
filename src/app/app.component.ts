import {Component, OnDestroy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {App} from "@capacitor/app";
import {PluginListenerHandle} from "@capacitor/core";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'character-sheet';
  private listener?: PluginListenerHandle;

  constructor() {
    App.addListener('backButton', ({canGoBack}) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    }).then(res => this.listener = res);
  }

  ngOnDestroy(): void {
    this.listener?.remove();
  }
}
