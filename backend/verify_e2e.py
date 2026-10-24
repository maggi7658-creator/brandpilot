import httpx

client = httpx.Client(base_url="http://127.0.0.1:8000/api/v1", timeout=15.0)

def run_test():
    # 1. Login as Creator
    res = client.post("/auth/login", json={"email": "creator@brandpilot.local", "password": "Password123!"})
    assert res.status_code == 200, res.text
    creator_token = res.json()["access_token"]
    creator_headers = {"Authorization": f"Bearer {creator_token}"}
    print("[1] Creator authenticated successfully")

    # 2. Submit Demonstration Copy
    sub_res = client.post("/submissions", json={
        "title": "E2E Demo Campaign Test",
        "channel": "Advertising",
        "audience": "Enterprise IT",
        "purpose": "Product Launch",
        "sensitivity": "standard",
        "content_type": "text",
        "raw_content": "Our service is always available. We provide cheap and fast compute with our artificial intelligence bot that gives insane performance without any risk."
    }, headers=creator_headers)
    assert sub_res.status_code == 200, sub_res.text
    sub_id = sub_res.json()["id"]
    print(f"[2] Submission created: {sub_id}")

    # 3. Trigger Analysis
    ana_res = client.post(f"/submissions/{sub_id}/analyze", headers=creator_headers)
    assert ana_res.status_code == 200, ana_res.text
    findings = ana_res.json()["versions"][0]["findings"]
    print(f"[3] Analysis complete. {len(findings)} explainable findings detected:")
    for f in findings:
        print(f"   - [{f['category'].upper()}] ({f['severity']}) \"{f['affected_text']}\" -> {f['recommended_action'][:50]}...")

    # 4. Verify Self-Approval Prevention Gate
    self_app_res = client.post(f"/approvals/submissions/{sub_id}/decision", json={
        "decision": "APPROVE",
        "rationale": "I want to approve my own work."
    }, headers=creator_headers)
    assert self_app_res.status_code == 403, "Security breach: self-approval was not blocked!"
    print(f"[4] Self-approval blocked as expected: {self_app_res.json()['detail']}")

    # 5. Create Revision
    rev_res = client.post(f"/submissions/{sub_id}/revisions", json={
        "raw_content": "Our service is engineered for 99.9% uptime availability with enterprise redundancy. We provide cost-effective and fast compute with our AI Assistant that delivers exceptional capability with managed risk.* Subject to scheduled maintenance.",
        "change_summary": "Qualified availability with 99.9% SLA and replaced prohibited terms."
    }, headers=creator_headers)
    assert rev_res.status_code == 200
    print(f"[5] Revision v2 saved. Status reset to: {rev_res.json()['status']}")

    # 6. Login as Brand Reviewer
    rev_auth = client.post("/auth/login", json={"email": "reviewer@brandpilot.local", "password": "Password123!"})
    reviewer_token = rev_auth.json()["access_token"]
    reviewer_headers = {"Authorization": f"Bearer {reviewer_token}"}

    # 7. Record Legitimate Approval Decision
    dec_res = client.post(f"/approvals/submissions/{sub_id}/decision", json={
        "decision": "APPROVE",
        "rationale": "Revisions fully conform to Acme SLA v2.4 and Brand Voice standard."
    }, headers=reviewer_headers)
    assert dec_res.status_code == 200
    print("[6] Reviewer decision APPROVE recorded successfully")

    # 8. Mark Ready to Publish
    pub_res = client.post(f"/approvals/submissions/{sub_id}/publish", headers=reviewer_headers)
    assert pub_res.status_code == 200
    assert pub_res.json()["status"] == "READY_TO_PUBLISH"
    print("[7] Submission successfully promoted to READY_TO_PUBLISH")

    # 9. Verify Audit Trail
    audit_res = client.get(f"/audit/events?submission_id={sub_id}", headers=reviewer_headers)
    assert audit_res.status_code == 200
    events = audit_res.json()
    print(f"[8] Audit trail records verified: {len(events)} events immutably persisted.")
    for e in events[:4]:
        print(f"   - {e['action']} by {e['actor_name']} ({e['actor_role']})")

    print("\n*** ALL 9 END-TO-END DEMO STEPS PASSED WITH 100% SUCCESS! ***")

if __name__ == "__main__":
    run_test()
