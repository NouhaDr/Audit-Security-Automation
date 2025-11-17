import { NgModule} from '@angular/core'; 
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ✅ Modules PrimeNG
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';


// ✅ Services
import { MessageService, ConfirmationService } from 'primeng/api';
import { EquipementService } from 'src/app/services/equipements.service';
import { SectionService } from 'src/app/services/section.service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        CommonModule,
        SharedModule,
        HttpClientModule,  // ✅ Correction
        FormsModule, 
        ReactiveFormsModule, 
        TableModule,        // ✅ Ajout pour `p-table`
        ToastModule,        // ✅ Ajout pour `p-toast`
        ButtonModule,
        DropdownModule,
        InputTextModule,
        AutoCompleteModule,
        MessagesModule,
        MessageModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        MessageService, 
        ConfirmationService,
        EquipementService,
        SectionService
    ],
    bootstrap: [AppComponent] 
})
export class AppModule {}
