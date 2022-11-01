import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { Constants } from '../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss']
})
export class StatusModalComponent implements OnInit {

  config: any;
  allStatus: any[] = [];
  flight: any;
  _putData: any;
  message!: string;

  constructor(private bsModalRef: BsModalRef,
    private service: ApiService,
    private toastr: ToastrService,
    private share: ShareService) {}

  ngOnInit(): void {
    this.share.message.subscribe(msg => this.message = msg);
    const { ON_TIME, CANCELLED, DELAYED, DEPARTED } = Constants;
    this.allStatus = [ON_TIME, DEPARTED, DELAYED, CANCELLED];
  }

  onClose() {
    this.bsModalRef.hide();
    this.share.newMessage(Constants.MODAL_CLOSE)
  }

  selectStatus(id: string, flight: any) {
    this._putData = {
      flightCode: flight,
      status: { id }
    }
  }

  updateStatus = () => {
    this.service.changeFlightStatus(this._putData).subscribe(() => {
      this.toastr.success('Status changed successfully!');
      this.onClose();
    })
  }

  decideCheck(id: number, selectedId: number) {
    return (id === selectedId)
  }

}
