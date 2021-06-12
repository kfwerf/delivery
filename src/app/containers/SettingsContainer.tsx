import React from "react";

export default function SettingsContainer() {

    const onClick = () => {

    };

    return (
        <section className="window">
            <div className="window-content">
                <form className="settings">
                    <div className="form-group">
                        <label>execPath</label>
                        <input type="text" className="form-control"  value={"/Users/kennethv/Development/delivery/src/bin/darwin/grpcurl"} />
                    </div>
                    <div className="form-group">
                        <label>Template</label>
                        <input type="text" className="form-control"  value={"{execPath} -plaintext -max-time 5 {params}"} />
                    </div>
                </form>
            </div>
            <footer className="toolbar toolbar-footer">
                <div className="toolbar-actions">

                </div>
            </footer>
        </section>
    );
}